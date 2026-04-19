import { notFound } from 'next/navigation'
import { getRealConversation } from '@/lib/realConversations'
import ConversationPlayer from '@/components/ConversationPlayer'

interface Props {
  params: { id: string }
}

export default function ConversationPage({ params }: Props) {
  const conversation = getRealConversation(params.id)
  if (!conversation) notFound()

  return <ConversationPlayer conversation={conversation} />
}
