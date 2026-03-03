import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const ProductCard = ({ product, onAdd, inCartQuantity = 0 }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-2xl bg-white soft-shadow"
    >
      <Link to={`/product/${product.id}`} className="block">
        <img src={product.image} alt={product.name} className="h-52 w-full object-cover" loading="lazy" />
      </Link>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {product.category}
          </span>
          <span className="text-sm text-amber-500">★ {product.rating}</span>
        </div>

        <Link to={`/product/${product.id}`} className="block text-lg font-semibold text-slate-900 hover:text-sky-700">
          {product.name}
        </Link>

        <p className="line-clamp-2 text-sm text-slate-500">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
            {product.old_price ? (
              <span className="text-sm text-slate-400 line-through">${Number(product.old_price).toFixed(2)}</span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {inCartQuantity > 0 ? (
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                In cart: {inCartQuantity}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => onAdd(product.id)}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Add {inCartQuantity > 0 ? `(${inCartQuantity})` : ''}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default ProductCard
