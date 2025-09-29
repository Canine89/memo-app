import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-utils'
import { MemoApp } from '@/components/memo-app'

export default async function Home() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth')
  }

  return <MemoApp user={user} />
}