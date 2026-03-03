import { motion } from 'framer-motion'

const Loader = ({ fullPage = false, label = 'Loading experience...' }) => {
  const wrapperClass = fullPage
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-slate-50'
    : 'flex items-center justify-center py-16'

  return (
    <div className={wrapperClass}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((item) => (
            <motion.span
              key={item}
              className="h-3 w-3 rounded-full bg-slate-700"
              animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                delay: item * 0.12,
              }}
            />
          ))}
        </div>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}

export default Loader
