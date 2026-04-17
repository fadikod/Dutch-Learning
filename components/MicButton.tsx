'use client'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  isListening: boolean
  isLoading: boolean
  isSpeaking: boolean
  onClick: () => void
}

export default function MicButton({ isListening, isLoading, isSpeaking, onClick }: Props) {
  const disabled = isLoading || isSpeaking

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {/* Pulse rings when listening */}
        <AnimatePresence>
          {isListening && (
            <>
              {[1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full bg-orange-500 opacity-20"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1 + i * 0.5, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        <motion.button
          onClick={onClick}
          disabled={disabled}
          whileTap={{ scale: 0.93 }}
          className={`
            relative z-10 w-20 h-20 rounded-full flex items-center justify-center
            text-white shadow-lg transition-colors duration-200
            ${isListening ? 'bg-red-500 shadow-red-200' : disabled ? 'bg-slate-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'}
          `}
        >
          {isLoading ? (
            <svg className="w-7 h-7 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : isListening ? (
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1a4 4 0 014 4v6a4 4 0 01-8 0V5a4 4 0 014-4zm-1 17.93V21h-2a1 1 0 000 2h6a1 1 0 000-2h-2v-2.07A8 8 0 0020 11h-2a6 6 0 01-12 0H4a8 8 0 007 7.93z" />
            </svg>
          )}
        </motion.button>
      </div>

      <p className="text-sm text-slate-500">
        {isLoading ? 'Verwerken...' : isListening ? 'Luisteren — klik om te stoppen' : isSpeaking ? 'AI spreekt...' : 'Klik om te spreken'}
      </p>
    </div>
  )
}
