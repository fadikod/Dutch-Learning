'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'

/** Strip vendor prefix for cleaner display: "Microsoft Frank Online (Natural) - Dutch (Netherlands)" → "Frank · Natural" */
function formatVoiceName(name: string): string {
  const n = name
    .replace(/microsoft\s*/i, '')
    .replace(/google\s*/i, '')
    .replace(/-\s*dutch.*$/i, '')
    .replace(/\(netherlands\)/i, '')
    .replace(/online/i, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()

  const isNatural = /natural|neural/i.test(name)
  return isNatural ? `${n} ✦` : n
}

interface Props {
  /** Pass the hook's shared state down so this component stays in sync */
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  onSelect: (v: SpeechSynthesisVoice) => void
}

export default function VoicePicker({ voices, selectedVoice, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const { speak } = useSpeechSynthesis()

  if (voices.length === 0) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-orange-500 border border-slate-200 hover:border-orange-300 rounded-lg px-2.5 py-1.5 transition-colors"
        title="Kies een stem"
      >
        <span>🔊</span>
        <span className="max-w-[90px] truncate">{selectedVoice ? formatVoiceName(selectedVoice.name) : 'Stem'}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute right-0 top-full mt-1.5 z-50 bg-white rounded-2xl shadow-xl border border-slate-100 w-64 overflow-hidden"
            >
              <div className="px-3 py-2 border-b border-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Kies een stem</p>
                <p className="text-xs text-slate-400">✦ = Natural / Neural kwaliteit</p>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {voices.map((v) => {
                  const isSelected = selectedVoice?.name === v.name
                  return (
                    <div
                      key={v.name}
                      className={`flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 transition-colors ${isSelected ? 'bg-orange-50' : ''}`}
                    >
                      <button
                        onClick={() => { onSelect(v); setOpen(false) }}
                        className="flex-1 text-left"
                      >
                        <p className={`text-sm font-medium ${isSelected ? 'text-orange-600' : 'text-slate-700'}`}>
                          {formatVoiceName(v.name)}
                        </p>
                        <p className="text-xs text-slate-400">{v.lang}</p>
                      </button>
                      {/* Preview button */}
                      <button
                        onClick={() => speak('Hallo, dit is een testje van mijn stem.')}
                        className="ml-2 text-slate-300 hover:text-orange-400 transition-colors shrink-0"
                        title="Beluister"
                      >
                        ▶
                      </button>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
