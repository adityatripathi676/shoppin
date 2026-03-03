import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductById } from '../api/client'
import Loader from '../components/Loader'
import { useShop } from '../context/ShopContext'

const ProductPage = () => {
  const { id } = useParams()
  const { addToCart } = useShop()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getProductById(id)
      .then((data) => {
        if (mounted) {
          setProduct(data)
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
  }, [id])

  const handleAdd = () => {
    for (let index = 0; index < quantity; index += 1) {
      addToCart(product.id)
    }
  }

  if (loading) {
    return <Loader label="Loading product..." />
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-500">Product not found.</p>
        <Link to="/shop" className="mt-4 inline-block text-sky-700">
          Back to shop
        </Link>
      </div>
    )
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:px-6">
      <img src={product.image} alt={product.name} className="h-[420px] w-full rounded-2xl object-cover soft-shadow" />

      <div className="space-y-5">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{product.category}</span>
        <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
        <p className="text-slate-600">{product.description}</p>
        <p className="text-sm text-slate-500">Stock available: {product.stock}</p>

        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
          {product.old_price ? (
            <span className="text-lg text-slate-400 line-through">${Number(product.old_price).toFixed(2)}</span>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((previous) => Math.max(1, previous - 1))}
            className="rounded-md border border-slate-300 px-3 py-2"
          >
            -
          </button>
          <span className="w-10 text-center font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((previous) => previous + 1)}
            className="rounded-md border border-slate-300 px-3 py-2"
          >
            +
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Add to cart
          </button>
          <Link to="/checkout" className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
            Go to checkout
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ProductPage
