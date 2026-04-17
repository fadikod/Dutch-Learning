import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const { messages, scenarioTitle } = await req.json()

  const conversationText = messages
    .map((m: { role: string; content: string }) =>
      `${m.role === 'user' ? 'Student' : 'Native speaker'}: ${m.content}`
    )
    .join('\n')

  const prompt = `You are a Dutch language teacher reviewing a conversation practice session.
Scenario: ${scenarioTitle}

Conversation:
${conversationText}

Respond ONLY with a valid JSON object (no markdown, no explanation) in this exact shape:
{
  "overallScore": 80,
  "strengths": ["Good use of ...", "Correct ..."],
  "mistakes": [
    {
      "original": "ik wil een brood",
      "correction": "Ik wil een brood, alstublieft.",
      "explanation": "Start with a capital and add alstublieft to sound polite."
    }
  ],
  "newVocabulary": [
    { "dutch": "alstublieft", "english": "please (formal)" }
  ],
  "tip": "One practical tip for next time."
}`

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 800,
  })

  const text = completion.choices[0].message.content ?? ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return NextResponse.json({ error: 'Could not parse feedback' }, { status: 500 })

  const feedback = JSON.parse(jsonMatch[0])
  return NextResponse.json(feedback)
}
