import { Link } from 'react-router-dom'

const socials = [
  {
    name: 'Instagram',
    href: '#',
    icon: '◉',
  },
  {
    name: 'X',
    href: '#',
    icon: '✕',
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: 'in',
  },
]

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-white/40 bg-white/40 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-slate-900">
              Shop<span className="text-sky-600">pin</span>
            </h3>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              Modern animated shopping experience with local order storage and demo payment flow.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Quick links</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
              <Link to="/shop" className="hover:text-slate-900">Shop</Link>
              <Link to="/orders" className="hover:text-slate-900">Orders</Link>
              <Link to="/contact" className="hover:text-slate-900">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Social</h4>
            <div className="mt-3 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-700 transition hover:border-slate-500"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200/60 pt-4 text-sm text-slate-500">
          © {new Date().getFullYear()} Shoppin • Limited info footer • Built with animated gradient glass style
        </div>
      </div>
    </footer>
  )
}

export default Footer
