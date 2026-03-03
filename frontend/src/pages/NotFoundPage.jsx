import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-sm font-semibold text-sky-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
        Back to Home
      </Link>
    </section>
  )
}

export default NotFoundPage
