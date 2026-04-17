'use client'
import { useRouter } from 'next/navigation'
import { scenarios, getRandomScenario } from '@/lib/scenarios'

const levelColors: Record<string, string> = {
  A1: 'bg-green-100 text-green-700',
  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-purple-100 text-purple-700',
}

export default function Home() {
  const router = useRouter()

  const goRandom = () => {
    const s = getRandomScenario()
    router.push(`/practice/${s.id}`)
  }

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-3xl">🇳🇱</span>
          <span className="text-xl font-bold text-orange-500">Spreek Mee</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 leading-tight">
          Oefen je Nederlands<br />
          <span className="text-orange-500">in echte gesprekken</span>
        </h1>
        <p className="text-slate-500 mt-3 text-sm">
          Kies een scenario of laat het lot beslissen. Gebruik Chrome voor de beste ervaring.
        </p>
      </div>

      {/* Random button */}
      <button
        onClick={goRandom}
        className="w-full mb-6 flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold py-4 rounded-2xl transition-all shadow-md shadow-orange-200"
      >
        <span className="text-xl">🎲</span>
        <span>Willekeurig scenario</span>
      </button>

      {/* Level filter hint */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Alle scenario&apos;s</span>
        <div className="flex-1 h-px bg-slate-100" />
        <div className="flex gap-1.5">
          {['A1', 'A2', 'B1'].map((l) => (
            <span key={l} className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelColors[l]}`}>{l}</span>
          ))}
        </div>
      </div>

      {/* Scenarios grid */}
      <div className="grid gap-2.5">
        {scenarios.map((s) => (
          <a
            key={s.id}
            href={`/practice/${s.id}`}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all flex items-center gap-4 group"
          >
            <span className="text-3xl shrink-0">{s.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-slate-800 group-hover:text-orange-600 transition-colors text-sm">
                  {s.dutchTitle}
                </p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${levelColors[s.level]}`}>
                  {s.level}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">{s.description}</p>
            </div>
            <svg className="w-4 h-4 text-slate-300 group-hover:text-orange-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>

      <p className="text-center text-xs text-slate-400 mt-8">
        {scenarios.length} scenario&apos;s · Powered by Groq · Made for Dutch learners
      </p>
    </main>
  )
}
