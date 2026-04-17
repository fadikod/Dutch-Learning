'use client'
import { useState, useRef, useCallback } from 'react'

interface ISpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  onstart: (() => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  onresult: ((e: SpeechRecognitionEvent) => void) | null
  start(): void
  stop(): void
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition
    webkitSpeechRecognition: new () => ISpeechRecognition
  }
}

export function useSpeechRecognition(onResult: (transcript: string) => void) {
  const [isListening, setIsListening] = useState(false)
  const [liveTranscript, setLiveTranscript] = useState('')
  const recognitionRef = useRef<ISpeechRecognition | null>(null)
  const finalRef = useRef('')

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      alert('Speech recognition is not supported. Please use Chrome.')
      return
    }

    const recognition = new SR()
    recognition.lang = 'nl-NL'
    recognition.continuous = true
    recognition.interimResults = true

    finalRef.current = ''

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i]
        if (result.isFinal) {
          finalRef.current += result[0].transcript + ' '
        } else {
          interim += result[0].transcript
        }
      }
      setLiveTranscript(finalRef.current + interim)
    }

    recognition.onend = () => {
      setIsListening(false)
      const text = finalRef.current.trim()
      setLiveTranscript('')
      finalRef.current = ''
      if (text) onResult(text)
    }

    recognition.onerror = () => {
      setIsListening(false)
      setLiveTranscript('')
      finalRef.current = ''
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [onResult])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  return { isListening, liveTranscript, startListening, stopListening }
}
