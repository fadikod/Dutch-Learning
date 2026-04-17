import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Spreek Mee — Dutch Speaking Practice',
  description: 'Practice your Dutch in real-life conversations with an AI partner',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  )
}
