import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
  }`

const Navbar = ({ cartCount }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <NavLink to="/" className="text-lg font-bold text-slate-900">
          Shop<span className="text-sky-600">pin</span>
        </NavLink>

        <nav className="flex items-center gap-1 md:gap-2">
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

        <NavLink
          to="/checkout"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
        >
          Cart ({cartCount})
        </NavLink>
      </div>
    </header>
  )
}

export default Navbar
