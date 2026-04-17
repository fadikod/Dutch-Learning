import { notFound } from 'next/navigation'
import { getScenario } from '@/lib/scenarios'
import ConversationInterface from '@/components/ConversationInterface'

interface Props {
  params: { scenario: string }
}

export default function PracticePage({ params }: Props) {
  const scenario = getScenario(params.scenario)
  if (!scenario) notFound()

  return <ConversationInterface scenario={scenario} />
}
