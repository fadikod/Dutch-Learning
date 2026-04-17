'use client'
import { motion } from 'framer-motion'

interface Props {
  role: 'user' | 'assistant'
  content: string
}

export default function MessageBubble({ role, content }: Props) {
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`
          max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? 'bg-orange-500 text-white rounded-br-sm'
            : 'bg-white text-slate-800 rounded-bl-sm shadow-sm border border-slate-100'}
        `}
      >
        {!isUser && (
          <p className="text-xs font-semibold text-orange-500 mb-1">AI Partner</p>
        )}
        <p>{content}</p>
      </div>
    </motion.div>
  )
}
