import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const { messages, systemPrompt } = await req.json()

  const history = messages.map((m: { role: string; content: string }) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }))

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'system', content: systemPrompt }, ...history],
    temperature: 0.7,
    max_tokens: 300,
  })

  const reply = completion.choices[0].message.content ?? ''
  return NextResponse.json({ reply })
}
