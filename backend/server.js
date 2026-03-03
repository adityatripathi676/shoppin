require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

const shippingFee = 8.0;
const taxRate = 0.08;

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'shopping-api' });
});

app.get('/api/products', (req, res) => {
  const category = req.query.category;
  const featured = req.query.featured;

  let query = 'SELECT * FROM products';
  const conditions = [];
  const values = [];

  if (category) {
    conditions.push('category = ?');
    values.push(category);
  }

  if (featured === 'true') {
    conditions.push('featured = 1');
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ' ORDER BY created_at DESC';
  const products = db.prepare(query).all(...values);
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  return res.json(product);
});

app.get('/api/orders', (_req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  const itemsByOrder = db
    .prepare('SELECT * FROM order_items ORDER BY id DESC')
    .all()
    .reduce((accumulator, item) => {
      if (!accumulator[item.order_id]) {
        accumulator[item.order_id] = [];
      }
      accumulator[item.order_id].push(item);
      return accumulator;
    }, {});

  const response = orders.map((order) => ({
    ...order,
    items: itemsByOrder[order.id] || [],
  }));

  res.json(response);
});

app.post('/api/payments/intent', (req, res) => {
  const { amount, provider = 'DemoPay' } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid payment amount' });
  }

  const providerPaymentId = `DEMO_${Date.now()}`;
  db.prepare(
    `
      INSERT INTO payments (provider, provider_payment_id, amount, status)
      VALUES (?, ?, ?, ?)
    `,
  ).run(provider, providerPaymentId, amount, 'authorized');

  return res.json({
    provider,
    providerPaymentId,
    clientSecret: `secret_${providerPaymentId}`,
    status: 'authorized',
  });
});

app.post('/api/orders', (req, res) => {
  const { customer, items, paymentMethod = 'DemoPay', paymentReference } = req.body;

  if (!customer || !customer.name || !customer.email || !customer.address) {
    return res.status(400).json({ message: 'Customer details are required' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order items are required' });
  }

  const productLookup = db.prepare('SELECT id, name, price, stock FROM products WHERE id = ?');

  let subtotal = 0;
  const normalizedItems = [];

  for (const item of items) {
    const product = productLookup.get(Number(item.productId));
    const quantity = Number(item.quantity || 0);

    if (!product || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product in order items' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: `${product.name} has limited stock` });
    }

    const lineTotal = Number((product.price * quantity).toFixed(2));
    subtotal += lineTotal;

    normalizedItems.push({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity,
      lineTotal,
    });
  }

  subtotal = Number(subtotal.toFixed(2));
  const tax = Number((subtotal * taxRate).toFixed(2));
  const total = Number((subtotal + shippingFee + tax).toFixed(2));

  const placeOrder = db.transaction(() => {
    const orderResult = db
      .prepare(
        `
          INSERT INTO orders (
            customer_name,
            customer_email,
            customer_address,
            subtotal,
            shipping,
            tax,
            total,
            payment_method,
            payment_status,
            status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      )
      .run(
        customer.name,
        customer.email,
        customer.address,
        subtotal,
        shippingFee,
        tax,
        total,
        paymentMethod,
        'paid',
        'placed',
      );

    const orderId = Number(orderResult.lastInsertRowid);

    const insertItem = db.prepare(
      `
        INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, line_total)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
    );

    const reduceStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

    for (const item of normalizedItems) {
      insertItem.run(orderId, item.productId, item.productName, item.quantity, item.unitPrice, item.lineTotal);
      reduceStock.run(item.quantity, item.productId);
    }

    if (paymentReference) {
      db.prepare(
        `
          UPDATE payments
          SET status = ?, order_id = ?
          WHERE provider_payment_id = ?
        `,
      ).run('captured', orderId, paymentReference);
    }

    return orderId;
  });

  const orderId = placeOrder();
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

  return res.status(201).json({ ...order, items: orderItems });
});

app.patch('/api/orders/:id/cancel', (req, res) => {
  const orderId = Number(req.params.id);
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.status === 'cancelled') {
    return res.status(400).json({ message: 'Order is already cancelled' });
  }

  const cancelOrder = db.transaction(() => {
    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);
    const increaseStock = db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?');

    for (const item of orderItems) {
      increaseStock.run(item.quantity, item.product_id);
    }

    db.prepare('UPDATE orders SET status = ?, payment_status = ? WHERE id = ?').run('cancelled', 'refunded', orderId);
    db.prepare('UPDATE payments SET status = ? WHERE order_id = ?').run('refunded', orderId);
  });

  cancelOrder();

  const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);
  return res.json({ ...updatedOrder, items: orderItems });
});

app.get('/api/dashboard', (_req, res) => {
  const totals = db
    .prepare(
      `
      SELECT
        COUNT(CASE WHEN status != 'cancelled' THEN 1 END) AS orderCount,
        COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END), 0) AS revenue
      FROM orders
      `,
    )
    .get();

  const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get();
  const recentPayments = db.prepare('SELECT * FROM payments ORDER BY created_at DESC LIMIT 5').all();

  res.json({
    orderCount: totals.orderCount,
    revenue: Number(Number(totals.revenue || 0).toFixed(2)),
    productCount: productCount.count,
    recentPayments,
  });
});

app.listen(port, () => {
  console.log(`Shopping API running on http://localhost:${port}`);
});
