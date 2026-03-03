import { motion } from 'framer-motion'
import SectionTitle from '../components/SectionTitle'

const contactCards = [
  {
    title: 'Sales Support',
    value: 'sales@shoppin.demo',
    detail: 'Product, discount, and bulk queries',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Help Desk',
    value: '+1 (800) 555-0147',
    detail: 'Order, delivery, and cancellation support',
    image:
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Office',
    value: 'Downtown, New York, US',
    detail: 'Mon-Sat · 9:00 AM to 7:00 PM',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80',
  },
]

const ContactPage = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <SectionTitle
        eyebrow="Contact"
        title="Let’s connect"
        subtitle="Reach us for order help, payment issues, and product questions."
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="animated-gradient-card glass overflow-hidden rounded-2xl p-4 soft-shadow sm:p-6"
      >
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Talk to our shopping team</h2>
            <p className="mt-2 text-slate-600">
              We reply quickly for order tracking, cancellation requests, and checkout support.
            </p>
            <form className="mt-5 space-y-3">
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-lg border border-slate-300/80 bg-white/80 px-3 py-2 text-sm"
              />
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-lg border border-slate-300/80 bg-white/80 px-3 py-2 text-sm"
              />
              <textarea
                rows={4}
                placeholder="How can we help?"
                className="w-full rounded-lg border border-slate-300/80 bg-white/80 px-3 py-2 text-sm"
              />
              <button
                type="button"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Send Message
              </button>
            </form>
          </div>

          <img
            src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80"
            alt="Contact support"
            className="h-56 w-full rounded-xl object-cover sm:h-72 md:h-[340px]"
          />
        </div>
      </motion.div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {contactCards.map((item) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="glass overflow-hidden rounded-2xl soft-shadow"
          >
            <img src={item.image} alt={item.title} className="h-36 w-full object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1 font-medium text-slate-700">{item.value}</p>
              <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default ContactPage
