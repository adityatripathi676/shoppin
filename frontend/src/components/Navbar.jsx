import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
  }`

const Navbar = ({ cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <NavLink to="/" className="text-lg font-bold text-slate-900">
            Shop<span className="text-sky-600">pin</span>
          </NavLink>

          <div className="flex items-center gap-2">
            <NavLink
              to="/checkout"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 sm:text-sm"
            >
              Cart ({cartCount})
            </NavLink>
            <button
              type="button"
              onClick={() => setIsMenuOpen((previous) => !previous)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 md:hidden"
            >
              Menu
            </button>
          </div>
        </div>

        <nav className="mt-3 hidden items-center gap-1 md:flex md:gap-2">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/shop" className={linkClass}>
            Shop
          </NavLink>
          <NavLink to="/checkout" className={linkClass}>
            Checkout
          </NavLink>
          <NavLink to="/orders" className={linkClass}>
            Orders
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </nav>

        {isMenuOpen ? (
          <nav className="mt-3 grid gap-2 md:hidden">
            <NavLink to="/" className={linkClass} end onClick={() => setIsMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/shop" className={linkClass} onClick={() => setIsMenuOpen(false)}>
              Shop
            </NavLink>
            <NavLink to="/checkout" className={linkClass} onClick={() => setIsMenuOpen(false)}>
              Checkout
            </NavLink>
            <NavLink to="/orders" className={linkClass} onClick={() => setIsMenuOpen(false)}>
              Orders
            </NavLink>
            <NavLink to="/contact" className={linkClass} onClick={() => setIsMenuOpen(false)}>
              Contact
            </NavLink>
          </nav>
        ) : null}
      </div>
    </header>
  )
}

export default Navbar
