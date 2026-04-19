'use client'
import { motion } from 'framer-motion'
import { Expression } from '@/lib/realConversations'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'

interface Props {
  expressions: Expression[]
  title: string
  onBack: () => void
}

export default function ExpressionsPanel({ expressions, title, onBack }: Props) {
  const { speak } = useSpeechSynthesis()

  return (
    <div className="flex flex-col h-[100dvh] max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-100 bg-white flex items-center gap-3">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <p className="font-semibold text-slate-800">Uitdrukkingen & woordenschat</p>
          <p className="text-xs text-slate-400">{title}</p>
        </div>
      </div>

      {/* Expressions list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
        <p className="text-xs text-slate-400 mb-4">
          Tik op een uitdrukking om hem te horen. 🔊
        </p>

        {expressions.map((expr, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            {/* Dutch phrase — tappable to hear */}
            <button
              onClick={() => speak(expr.dutch)}
              className="w-full text-left px-4 pt-4 pb-2 flex items-start justify-between gap-3 hover:bg-orange-50 transition-colors"
            >
              <p className="font-semibold text-slate-800 text-base">{expr.dutch}</p>
              <span className="text-slate-300 text-sm shrink-0 mt-0.5">🔊</span>
            </button>

            <div className="px-4 pb-4">
              {/* English translation */}
              <p className="text-orange-500 font-medium text-sm mb-1.5">{expr.english}</p>
              {/* Usage note */}
              <p className="text-slate-500 text-xs leading-relaxed">{expr.note}</p>
            </div>
          </motion.div>
        ))}

        {/* Back to conversation */}
        <div className="pt-2 pb-4">
          <button
            onClick={onBack}
            className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-3.5 rounded-2xl transition-colors"
          >
            ← Terug naar gesprek
          </button>
        </div>
      </div>
    </div>
  )
}
