'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Mistake {
  original: string
  correction: string
  explanation: string
}

interface VocabItem {
  dutch: string
  english: string
}

interface Feedback {
  overallScore: number
  strengths: string[]
  mistakes: Mistake[]
  newVocabulary: VocabItem[]
  tip: string
}

interface Props {
  feedback: Feedback
  scenarioTitle: string
}

export default function FeedbackPanel({ feedback, scenarioTitle }: Props) {
  const score = feedback.overallScore
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-orange-500' : 'text-red-500'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-4 space-y-5"
    >
      {/* Score */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
        <p className="text-slate-500 text-sm mb-1">{scenarioTitle} — Samenvatting</p>
        <p className={`text-6xl font-bold ${scoreColor}`}>{score}</p>
        <p className="text-slate-400 text-sm mt-1">/ 100</p>
      </div>

      {/* Strengths */}
      {feedback.strengths.length > 0 && (
        <div className="bg-green-50 rounded-2xl p-5">
          <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
            <span>Goed gedaan</span>
          </h3>
          <ul className="space-y-2">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="text-green-800 text-sm flex gap-2">
                <span className="mt-0.5 shrink-0">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mistakes */}
      {feedback.mistakes.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-700 mb-3">Verbeterpunten</h3>
          <div className="space-y-4">
            {feedback.mistakes.map((m, i) => (
              <div key={i} className="border-l-2 border-orange-300 pl-3">
                <p className="text-sm text-red-500 line-through">{m.original}</p>
                <p className="text-sm text-green-700 font-medium">{m.correction}</p>
                <p className="text-xs text-slate-500 mt-1">{m.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vocabulary */}
      {feedback.newVocabulary.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-700 mb-3">Woordenschat</h3>
          <div className="grid grid-cols-2 gap-2">
            {feedback.newVocabulary.map((v, i) => (
              <div key={i} className="bg-slate-50 rounded-lg px-3 py-2">
                <p className="font-medium text-sm text-slate-800">{v.dutch}</p>
                <p className="text-xs text-slate-500">{v.english}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tip */}
      {feedback.tip && (
        <div className="bg-orange-50 rounded-2xl p-5">
          <h3 className="font-semibold text-orange-700 mb-1">Tip voor volgende keer</h3>
          <p className="text-orange-800 text-sm">{feedback.tip}</p>
        </div>
      )}

      <Link
        href="/"
        className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-2xl transition-colors"
      >
        Nog een gesprek
      </Link>
    </motion.div>
  )
}
