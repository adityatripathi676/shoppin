import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getDashboard } from '../api/client'
import { useShop } from '../context/ShopContext'
import ProductCard from '../components/ProductCard'
import SectionTitle from '../components/SectionTitle'

const categories = ['Fashion', 'Electronics', 'Home']

const HomePage = () => {
  const { products, addToCart } = useShop()
  const [dashboard, setDashboard] = useState({ orderCount: 0, revenue: 0, productCount: 0 })

  useEffect(() => {
    let mounted = true
    getDashboard().then((data) => {
      if (mounted) {
        setDashboard(data)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  const featured = products.filter((item) => item.featured).slice(0, 3)

  return (
    <div>
      <section className="relative min-h-[100vh] overflow-hidden border-b border-slate-200">
        <img
          src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1800&q=80"
          alt="Shopping hero"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative mx-auto grid min-h-[100vh] max-w-6xl content-center gap-8 px-4 py-16 md:grid-cols-2 md:px-6 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <p className="text-sm font-semibold tracking-wide text-sky-300">Spring Collection 2026</p>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              Dynamic shopping experience with smooth modern UI
            </h1>
            <p className="max-w-lg text-slate-200">
              Explore products, add to cart, checkout with demo payment, and store order records in local
              database for future viewing.
            </p>
            <div className="flex gap-3">
              <Link to="/shop" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-200">
                Start Shopping
              </Link>
              <Link
                to="/orders"
                className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                View Orders
              </Link>
            </div>

            <a
              href="#discover-sections"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
            >
              Scroll to explore ↓
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="rounded-2xl border border-white/20 bg-white/15 p-5 text-white backdrop-blur">
              <p className="text-sm text-slate-200">Products</p>
              <p className="mt-2 text-2xl font-bold">{dashboard.productCount}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/15 p-5 text-white backdrop-blur">
              <p className="text-sm text-slate-200">Orders</p>
              <p className="mt-2 text-2xl font-bold">{dashboard.orderCount}</p>
            </div>
            <div className="col-span-2 rounded-2xl border border-white/20 bg-white/15 p-5 text-white backdrop-blur">
              <p className="text-sm text-slate-200">Revenue</p>
              <p className="mt-2 text-3xl font-bold">${dashboard.revenue.toFixed(2)}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="discover-sections" className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <SectionTitle
          eyebrow="Demo Sections"
          title="Shop by category"
          subtitle="Quickly browse curated categories with soft transitions and lightweight interactions."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((item) => (
            <motion.div
              key={item}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow"
            >
              <p className="text-sm text-sky-600">Category</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">{item}</h3>
              <Link to={`/shop?category=${item}`} className="mt-4 inline-block text-sm font-medium text-slate-700 hover:text-sky-700">
                Explore {item} →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 md:px-6">
        <SectionTitle
          eyebrow="Featured"
          title="Top picks for you"
          subtitle="Handpicked items with instant add-to-cart actions and polished card layout."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
