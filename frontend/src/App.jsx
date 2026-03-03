import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Loader from './components/Loader'
import HowItWorksPopup from './components/HowItWorksPopup'
import { useShop } from './context/ShopContext'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'

const App = () => {
  const location = useLocation()
  const { cartItems } = useShop()
  const [isBootLoading, setIsBootLoading] = useState(true)
  const [isGuideOpen, setIsGuideOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsBootLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  if (isBootLoading) {
    return <Loader fullPage label="Preparing your shopping experience..." />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar cartCount={cartCount} />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname + location.search}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <button
        type="button"
        onClick={() => setIsGuideOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white soft-shadow transition hover:bg-slate-700"
      >
        Guide
      </button>
      <HowItWorksPopup isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  )
}

export default App
