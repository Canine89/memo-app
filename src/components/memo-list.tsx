'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MemoForm } from './memo-form'
import { Edit, Trash2, Plus } from 'lucide-react'

interface Memo {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface MemoListProps {
  memos: Memo[]
  onRefresh: () => void
}

export function MemoList({ memos, onRefresh }: MemoListProps) {
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = (memo: Memo) => {
    setEditingMemo(memo)
    setIsCreating(false)
  }

  const handleCreate = () => {
    setEditingMemo(null)
    setIsCreating(true)
  }

  const handleCancel = () => {
    setEditingMemo(null)
    setIsCreating(false)
  }

  const handleSave = async (memoData: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true)
    
    try {
      const url = editingMemo ? `/api/memos/${editingMemo.id}` : '/api/memos'
      const method = editingMemo ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memoData),
      })

      if (!response.ok) {
        throw new Error('메모 저장에 실패했습니다.')
      }

      onRefresh()
      handleCancel()
    } catch (error) {
      console.error('메모 저장 오류:', error)
      alert('메모 저장에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 메모를 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`/api/memos/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('메모 삭제에 실패했습니다.')
      }

      onRefresh()
    } catch (error) {
      console.error('메모 삭제 오류:', error)
      alert('메모 삭제에 실패했습니다.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">내 메모</h2>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          새 메모
        </Button>
      </div>

      {(isCreating || editingMemo) && (
        <MemoForm
          memo={editingMemo || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      )}

      <div className="grid gap-4">
        {memos.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">아직 메모가 없습니다. 새 메모를 만들어보세요!</p>
            </CardContent>
          </Card>
        ) : (
          memos.map((memo) => (
            <Card key={memo.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{memo.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(memo)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(memo.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(memo.updatedAt)}
                </p>
              </CardHeader>
              {memo.content && (
                <CardContent>
                  <p className="whitespace-pre-wrap">{memo.content}</p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
