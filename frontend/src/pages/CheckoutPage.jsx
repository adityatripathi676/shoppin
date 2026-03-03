import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { useShop } from '../context/ShopContext'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, shipping, tax, total, placeOrder } = useShop()

  const [customer, setCustomer] = useState({ name: '', email: '', address: '' })
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const handleCancelOrder = () => {
    clearCart()
    setCustomer({ name: '', email: '', address: '' })
    setError('')
  }

  const handlePlaceOrder = async (event) => {
    event.preventDefault()
    setError('')

    if (!customer.name || !customer.email || !customer.address) {
      setError('Please fill all customer details.')
      return
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty.')
      return
    }

    try {
      setProcessing(true)
      const order = await placeOrder(customer)
      navigate(`/orders?new=${order.id}`)
    } catch (apiError) {
      const message = apiError.response?.data?.message || 'Failed to place order'
      setError(message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
      <div className="space-y-4 md:col-span-2">
        <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
        <p className="text-sm text-slate-500">Secure demo checkout powered by DemoPay gateway.</p>

        <div className="space-y-3">
          {cartItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              Cart is empty. <Link to="/shop" className="text-sky-700">Browse products</Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.productId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 soft-shadow">
                <div>
                  <p className="font-semibold text-slate-900">{item.product.name}</p>
                  <p className="text-sm text-slate-500">${item.product.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="rounded border border-slate-300 px-2 py-1"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="rounded border border-slate-300 px-2 py-1"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="ml-2 rounded border border-red-200 px-2 py-1 text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-4 rounded-2xl bg-white p-5 soft-shadow">
          <h2 className="text-lg font-semibold text-slate-900">Customer details</h2>
          <input
            type="text"
            placeholder="Full name"
            value={customer.name}
            onChange={(event) => setCustomer((previous) => ({ ...previous, name: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={customer.email}
            onChange={(event) => setCustomer((previous) => ({ ...previous, email: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <textarea
            placeholder="Shipping address"
            value={customer.address}
            onChange={(event) => setCustomer((previous) => ({ ...previous, address: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            rows={3}
          />

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            Demo payment gateway: Card • Wallet • UPI (simulated authorization + capture)
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={processing || cartItems.length === 0}
            className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? 'Processing payment...' : `Pay $${total.toFixed(2)} and Place Order`}
          </button>

          <button
            type="button"
            onClick={handleCancelOrder}
            disabled={processing || cartItems.length === 0}
            className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel Current Order
          </button>

          {cartItems.length === 0 ? (
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Continue Shopping
            </button>
          ) : null}
        </form>
      </div>

      <aside className="h-fit rounded-2xl bg-white p-5 soft-shadow">
        <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="my-2 border-t border-slate-200" />
          <div className="flex justify-between text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </aside>

      {processing ? <Loader fullPage label="Authorizing payment and creating order..." /> : null}
    </section>
  )
}

export default CheckoutPage
