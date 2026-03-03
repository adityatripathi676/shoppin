import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cancelOrder, getOrders } from '../api/client'
import Loader from '../components/Loader'
import SectionTitle from '../components/SectionTitle'

const statusClasses = {
  placed: 'bg-sky-100 text-sky-700 border-sky-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
}

const getOrderImage = (status) => {
  if (status === 'cancelled') {
    return 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80'
  }

  return 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=900&q=80'
}

const OrdersPage = () => {
  const [searchParams] = useSearchParams()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState('')
  const [cancellingOrderId, setCancellingOrderId] = useState(null)

  const newOrder = searchParams.get('new')

  useEffect(() => {
    let mounted = true
    getOrders()
      .then((data) => {
        if (mounted) {
          setOrders(data)
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  const handleCancelOrder = async (orderId) => {
    try {
      setActionError('')
      setCancellingOrderId(orderId)
      const updated = await cancelOrder(orderId)

      setOrders((previous) =>
        previous.map((order) => (order.id === orderId ? { ...order, ...updated } : order)),
      )
    } catch (apiError) {
      const message = apiError.response?.data?.message || 'Failed to cancel order'
      setActionError(message)
    } finally {
      setCancellingOrderId(null)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <SectionTitle
        eyebrow="Order Storage"
        title="Saved shopping records"
        subtitle="Orders are stored in local SQLite database and shown here for future reference with status management."
      />

      {newOrder ? (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Payment successful. Order #{newOrder} created.
        </div>
      ) : null}

      {loading ? <Loader label="Loading order history..." /> : null}

      {actionError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      {!loading && orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No orders yet.
        </div>
      ) : null}

      <div className="space-y-4">
        {orders.map((order) => (
          <motion.article
            key={order.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="overflow-hidden rounded-2xl border border-white/40 bg-white/70 soft-shadow backdrop-blur"
          >
            <img src={getOrderImage(order.status)} alt="Order visual" className="h-44 w-full object-cover" />
            <div className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Order #{order.id}</h3>
                  <p className="text-sm text-slate-500">
                    {order.customer_name} • {order.customer_email}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses[order.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}
                  >
                    {order.status}
                  </span>
                  <p className="mt-2 text-lg font-bold text-slate-900">${Number(order.total).toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Payment</p>
                  <p className="mt-1 font-medium text-slate-800">{order.payment_method}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Payment status</p>
                  <p className="mt-1 font-medium text-slate-800">{order.payment_status}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Address</p>
                  <p className="mt-1 font-medium text-slate-800">{order.customer_address}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span>
                      {item.product_name} × {item.quantity}
                    </span>
                    <span>${Number(item.line_total).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {order.status === 'placed' ? (
                <button
                  type="button"
                  onClick={() => handleCancelOrder(order.id)}
                  disabled={cancellingOrderId === order.id}
                  className="mt-4 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel placed order'}
                </button>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default OrdersPage
