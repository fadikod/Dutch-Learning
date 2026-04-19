'use client'
import { useState, useCallback, useEffect, useRef } from 'react'

const STORAGE_KEY = 'spreek-mee-voice'

/** Score a voice — higher = more natural (neural/online voices win) */
function scoreVoice(v: SpeechSynthesisVoice): number {
  const n = v.name.toLowerCase()
  let score = 0
  if (n.includes('natural')) score += 5
  if (n.includes('neural'))  score += 5
  if (n.includes('online'))  score += 4
  if (n.includes('premium')) score += 3
  if (n.includes('google'))  score += 2
  if (n.includes('microsoft')) score += 1
  return score
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking]     = useState(false)
  const [voices, setVoices]             = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoiceState] = useState<SpeechSynthesisVoice | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    const load = () => {
      const all = window.speechSynthesis.getVoices()
      const dutch = all
        .filter(v => v.lang.startsWith('nl'))
        .sort((a, b) => scoreVoice(b) - scoreVoice(a))

      if (dutch.length === 0) return
      setVoices(dutch)

      // Restore saved preference or pick best scored voice
      const saved = localStorage.getItem(STORAGE_KEY)
      const restored = saved ? dutch.find(v => v.name === saved) : null
      const chosen = restored ?? dutch[0]
      voiceRef.current = chosen
      setSelectedVoiceState(chosen)
    }

    load()
    window.speechSynthesis.onvoiceschanged = load
  }, [])

  const setSelectedVoice = useCallback((v: SpeechSynthesisVoice) => {
    voiceRef.current = v
    setSelectedVoiceState(v)
    localStorage.setItem(STORAGE_KEY, v.name)
  }, [])

  const speak = useCallback((text: string, rate = 0.9) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'nl-NL'
    utterance.rate = rate
    utterance.pitch = 1
    if (voiceRef.current) utterance.voice = voiceRef.current

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend   = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { isSpeaking, speak, stop, voices, selectedVoice, setSelectedVoice }
}
