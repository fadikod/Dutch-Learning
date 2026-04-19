'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scenario } from '@/lib/scenarios'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import MessageBubble from './MessageBubble'
import MicButton from './MicButton'
import FeedbackPanel from './FeedbackPanel'
import VoicePicker from './VoicePicker'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Feedback {
  overallScore: number
  strengths: string[]
  mistakes: { original: string; correction: string; explanation: string }[]
  newVocabulary: { dutch: string; english: string }[]
  tip: string
}

export default function ConversationInterface({ scenario }: { scenario: Scenario }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: scenario.openingLine },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isFetchingFeedback, setIsFetchingFeedback] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { isSpeaking, speak, stop, voices, selectedVoice, setSelectedVoice } = useSpeechSynthesis()

  // Speak the opening line on mount
  useEffect(() => {
    speak(scenario.openingLine)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim()) return

      const updated: Message[] = [...messages, { role: 'user', content: userText }]
      setMessages(updated)
      setIsLoading(true)

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updated, systemPrompt: scenario.systemPrompt }),
        })
        const { reply } = await res.json()
        const next: Message[] = [...updated, { role: 'assistant', content: reply }]
        setMessages(next)
        speak(reply)
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, er is iets misgegaan. Probeer het opnieuw.' },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, scenario.systemPrompt, speak]
  )

  const { isListening, liveTranscript, startListening, stopListening } = useSpeechRecognition(sendMessage)

  const handleMicClick = () => {
    if (isSpeaking) { stop(); return }
    if (isListening) { stopListening(); return }
    startListening()
  }

  const endConversation = async () => {
    const userMessages = messages.filter((m) => m.role === 'user')
    if (userMessages.length === 0) return
    stop()
    setIsFetchingFeedback(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, scenarioTitle: scenario.dutchTitle }),
      })
      const data = await res.json()
      setFeedback(data)
    } catch {
      setFeedback(null)
    } finally {
      setIsFetchingFeedback(false)
    }
  }

  if (feedback) {
    return <FeedbackPanel feedback={feedback} scenarioTitle={scenario.dutchTitle} />
  }

  return (
    <div className="flex flex-col h-[100dvh] max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{scenario.emoji}</span>
          <div>
            <p className="font-semibold text-slate-800">{scenario.dutchTitle}</p>
            <p className="text-xs text-slate-400">{scenario.level} niveau</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <VoicePicker voices={voices} selectedVoice={selectedVoice} onSelect={setSelectedVoice} />
          <button
            onClick={endConversation}
            disabled={isFetchingFeedback || messages.filter((m) => m.role === 'user').length === 0}
            className="text-sm text-slate-500 hover:text-slate-700 disabled:opacity-40 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors"
          >
            {isFetchingFeedback ? 'Laden...' : 'Einde gesprek'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} content={m.content} />
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-slate-100">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-slate-300"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Mic */}
      <div className="px-4 py-5 bg-white border-t border-slate-100 flex flex-col items-center gap-3">
        {liveTranscript && (
          <div className="w-full max-w-sm bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 italic">
            {liveTranscript}
          </div>
        )}
        <MicButton
          isListening={isListening}
          isLoading={isLoading}
          isSpeaking={isSpeaking}
          onClick={handleMicClick}
        />
      </div>
    </div>
  )
}
