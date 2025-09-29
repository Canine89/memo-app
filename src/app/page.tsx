import { redirect } from 'next/navigation'
import { getCurrentUserFromServer } from '@/lib/supabase-auth'
import { MemoApp } from '@/components/memo-app'

export default async function Home() {
  const user = await getCurrentUserFromServer()

  if (!user) {
    redirect('/auth')
  }

  return <MemoApp user={user} />
}