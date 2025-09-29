'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Memo {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface MemoFormProps {
  memo?: Memo
  onSave: (memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
  isLoading?: boolean
}

export function MemoForm({ memo, onSave, onCancel, isLoading = false }: MemoFormProps) {
  const [formData, setFormData] = useState({
    title: memo?.title || '',
    content: memo?.content || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title.trim()) {
      onSave(formData)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {memo ? '메모 수정' : '새 메모'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="메모 제목을 입력하세요"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="메모 내용을 입력하세요"
              rows={6}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading || !formData.title.trim()}>
              {isLoading ? '저장 중...' : (memo ? '수정' : '저장')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
