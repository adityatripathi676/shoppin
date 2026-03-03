const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'shopping.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    price REAL NOT NULL,
    old_price REAL,
    rating REAL DEFAULT 4.0,
    featured INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    subtotal REAL NOT NULL,
    shipping REAL NOT NULL,
    tax REAL NOT NULL,
    total REAL NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    status TEXT NOT NULL DEFAULT 'placed',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    line_total REAL NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY(product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    provider TEXT NOT NULL,
    provider_payment_id TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id)
  );
`);

const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;

if (productCount === 0) {
  const seed = db.prepare(`
    INSERT INTO products (name, category, description, image, price, old_price, rating, featured, stock)
    VALUES (@name, @category, @description, @image, @price, @old_price, @rating, @featured, @stock)
  `);

  const seedProducts = [
    {
      name: 'AeroFlex Running Shoes',
      category: 'Fashion',
      description: 'Lightweight shoes with breathable mesh and responsive sole.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      price: 79.99,
      old_price: 99.99,
      rating: 4.7,
      featured: 1,
      stock: 40,
    },
    {
      name: 'Nova Smartwatch',
      category: 'Electronics',
      description: 'Track health metrics and notifications with 7-day battery life.',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      price: 149.0,
      old_price: 179.0,
      rating: 4.6,
      featured: 1,
      stock: 25,
    },
    {
      name: 'Minimal Desk Lamp',
      category: 'Home',
      description: 'Soft warm lighting with touch dimmer for your workspace.',
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
      price: 39.5,
      old_price: 49.0,
      rating: 4.4,
      featured: 0,
      stock: 60,
    },
    {
      name: 'CloudBlend Hoodie',
      category: 'Fashion',
      description: 'Ultra-soft cotton blend hoodie for all-day comfort.',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
      price: 55.0,
      old_price: 69.0,
      rating: 4.8,
      featured: 1,
      stock: 80,
    },
    {
      name: 'Pulse Wireless Earbuds',
      category: 'Electronics',
      description: 'Noise isolation and premium bass in a compact design.',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
      price: 89.0,
      old_price: 109.0,
      rating: 4.5,
      featured: 0,
      stock: 35,
    },
    {
      name: 'Zen Aroma Diffuser',
      category: 'Home',
      description: 'Elegant diffuser with timer modes for relaxing ambiance.',
      image: 'https://images.unsplash.com/photo-1616627452887-7df92aafd7e4?auto=format&fit=crop&w=800&q=80',
      price: 32.99,
      old_price: 42.99,
      rating: 4.3,
      featured: 0,
      stock: 50,
    },
  ];

  const insertMany = db.transaction((rows) => {
    for (const row of rows) {
      seed.run(row);
    }
  });

  insertMany(seedProducts);
}

module.exports = db;
