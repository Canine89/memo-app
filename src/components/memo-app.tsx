'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MemoList } from './memo-list'
import { LogOut, User } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string | null
}

interface Memo {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface MemoAppProps {
  user: User
}

export function MemoApp({ user }: MemoAppProps) {
  const [memos, setMemos] = useState<Memo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchMemos = async () => {
    try {
      const response = await fetch('/api/memos')
      if (response.ok) {
        const data = await response.json()
        setMemos(data)
      }
    } catch (error) {
      console.error('메모 조회 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMemos()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/auth'
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">메모 앱</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{user.name || user.email}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <MemoList memos={memos} onRefresh={fetchMemos} />
      </main>
    </div>
  )
}
