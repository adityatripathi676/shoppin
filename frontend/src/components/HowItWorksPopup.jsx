import { AnimatePresence, motion } from 'framer-motion'

const steps = [
  {
    title: 'Browse products',
    description: 'Open Shop, filter categories, and explore product cards.',
  },
  {
    title: 'Add and track count',
    description: 'Click Add to Cart and see live quantity count on each product card.',
  },
  {
    title: 'Checkout securely',
    description: 'Review items, update quantity, or cancel the current order before payment.',
  },
  {
    title: 'Demo payment gateway',
    description: 'The app simulates authorization and captures payment with DemoPay.',
  },
  {
    title: 'View saved records',
    description: 'Open Orders to see data stored in local SQLite for future access.',
  },
]

const HowItWorksPopup = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 soft-shadow sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">How this website works</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold tracking-wide text-sky-700">Step {index + 1}</p>
                  <h3 className="mt-1 font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default HowItWorksPopup
