'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RealConversation } from '@/lib/realConversations'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import ExpressionsPanel from './ExpressionsPanel'

export default function ConversationPlayer({ conversation }: { conversation: RealConversation }) {
  const [showTranslations, setShowTranslations] = useState(false)
  const [showExpressions, setShowExpressions] = useState(false)
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const { speak, stop, isSpeaking } = useSpeechSynthesis()

  const handleLineClick = (index: number, text: string) => {
    if (playingIndex === index && isSpeaking) {
      stop()
      setPlayingIndex(null)
      return
    }
    setPlayingIndex(index)
    speak(text)
  }

  const speakerColors = {
    A: { bubble: 'bg-white border border-slate-100', name: 'text-orange-500' },
    B: { bubble: 'bg-orange-500 text-white', name: 'text-orange-200' },
  }

  if (showExpressions) {
    return (
      <ExpressionsPanel
        expressions={conversation.expressions}
        title={conversation.dutchTitle}
        onBack={() => setShowExpressions(false)}
      />
    )
  }

  return (
    <div className="flex flex-col h-[100dvh] max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/conversations" className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <span className="text-2xl">{conversation.emoji}</span>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{conversation.dutchTitle}</p>
              <p className="text-xs text-slate-400">{conversation.speakers.A} & {conversation.speakers.B}</p>
            </div>
          </div>
          <button
            onClick={() => setShowTranslations(!showTranslations)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              showTranslations
                ? 'bg-orange-500 text-white border-orange-500'
                : 'text-slate-500 border-slate-200 hover:border-orange-300'
            }`}
          >
            🇬🇧 Vertaling
          </button>
        </div>
        {/* Context */}
        <p className="text-xs text-slate-400 mt-2 italic leading-relaxed">{conversation.context}</p>
      </div>

      {/* Dialogue */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
        {conversation.lines.map((line, i) => {
          const isA = line.speaker === 'A'
          const colors = speakerColors[line.speaker]
          const isPlaying = playingIndex === i && isSpeaking

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex flex-col ${isA ? 'items-start' : 'items-end'}`}
            >
              <p className={`text-xs font-semibold mb-1 px-1 ${isA ? 'text-orange-500' : 'text-slate-400'}`}>
                {isA ? conversation.speakers.A : conversation.speakers.B}
              </p>
              <button
                onClick={() => handleLineClick(i, line.dutch)}
                className={`
                  max-w-[82%] text-left px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all
                  ${isA ? 'rounded-tl-sm bg-white border border-slate-100 shadow-sm text-slate-800' : 'rounded-tr-sm bg-orange-500 text-white'}
                  ${isPlaying ? 'ring-2 ring-offset-1 ring-orange-400 scale-[1.01]' : 'hover:opacity-80'}
                `}
              >
                <span className="flex items-start gap-2">
                  <span className="flex-1">{line.dutch}</span>
                  <span className="shrink-0 mt-0.5 opacity-60 text-xs">
                    {isPlaying ? '🔊' : '▶'}
                  </span>
                </span>
                <AnimatePresence>
                  {showTranslations && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`text-xs mt-1.5 ${isA ? 'text-slate-400' : 'text-orange-100'}`}
                    >
                      {line.english}
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          )
        })}

        {/* End of conversation */}
        <div className="pt-4 pb-2 text-center">
          <p className="text-xs text-slate-400 mb-4">— Einde gesprek —</p>
          <button
            onClick={() => setShowExpressions(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold py-4 rounded-2xl transition-all shadow-md shadow-orange-200 flex items-center justify-center gap-2"
          >
            <span>📖</span>
            <span>Bekijk uitdrukkingen & woordenschat</span>
          </button>
        </div>
      </div>
    </div>
  )
}
