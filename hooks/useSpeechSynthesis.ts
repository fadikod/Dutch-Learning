'use client'
import { useState, useCallback, useEffect, useRef } from 'react'

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const dutchVoiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      dutchVoiceRef.current = voices.find((v) => v.lang.startsWith('nl')) ?? null
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'nl-NL'
    utterance.rate = 0.88
    utterance.pitch = 1
    if (dutchVoiceRef.current) utterance.voice = dutchVoiceRef.current

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { isSpeaking, speak, stop }
}
