'use client'
import { useRouter } from 'next/navigation'
import { realConversations, getRandomRealConversation } from '@/lib/realConversations'

const levelColors: Record<string, string> = {
  A1: 'bg-green-100 text-green-700',
  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-purple-100 text-purple-700',
}

export default function ConversationsPage() {
  const router = useRouter()

  const goRandom = () => {
    const c = getRandomRealConversation()
    router.push(`/conversations/${c.id}`)
  }

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <a href="/" className="text-sm text-slate-400 hover:text-orange-500 flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Terug naar home
        </a>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">💬</span>
          <h1 className="text-2xl font-bold text-slate-800">Echte Gesprekken</h1>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed">
          Lees en beluister echte Nederlandse gesprekken. Klik op elke zin om hem te horen.
          Aan het einde zie je alle uitdrukkingen en vaste zinsdelen.
        </p>
      </div>

      {/* Random button */}
      <button
        onClick={goRandom}
        className="w-full mb-6 flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold py-4 rounded-2xl transition-all shadow-md shadow-orange-200"
      >
        <span className="text-xl">🎲</span>
        <span>Willekeurig gesprek</span>
      </button>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Alle gesprekken</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      <div className="grid gap-2.5">
        {realConversations.map((c) => (
          <a
            key={c.id}
            href={`/conversations/${c.id}`}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all flex items-center gap-4 group"
          >
            <span className="text-3xl shrink-0">{c.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-slate-800 group-hover:text-orange-600 transition-colors text-sm">
                  {c.dutchTitle}
                </p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${levelColors[c.level]}`}>
                  {c.level}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">{c.description}</p>
              <p className="text-xs text-slate-400 mt-0.5">{c.speakers.A} & {c.speakers.B} · {c.lines.length} zinnen · {c.expressions.length} uitdrukkingen</p>
            </div>
            <svg className="w-4 h-4 text-slate-300 group-hover:text-orange-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>

      <p className="text-center text-xs text-slate-400 mt-8">
        {realConversations.length} gesprekken · Authentiek dagelijks Nederlands
      </p>
    </main>
  )
}
