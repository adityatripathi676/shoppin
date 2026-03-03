import { motion } from 'framer-motion'

const SectionTitle = ({ eyebrow, title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.45 }}
    className="mb-8"
  >
    {eyebrow ? <p className="text-sm font-semibold tracking-wide text-sky-600">{eyebrow}</p> : null}
    <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">{title}</h2>
    {subtitle ? <p className="mt-2 max-w-2xl text-slate-600">{subtitle}</p> : null}
  </motion.div>
)

export default SectionTitle
