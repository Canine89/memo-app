'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { resendConfirmationEmail } from '@/lib/supabase-auth'

interface EmailConfirmationProps {
  email: string
  onResendSuccess: () => void
}

export function EmailConfirmation({ email, onResendSuccess }: EmailConfirmationProps) {
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState('')

  const handleResend = async () => {
    setIsResending(true)
    setMessage('')

    try {
      await resendConfirmationEmail(email)
      setMessage('확인 이메일이 재발송되었습니다. 이메일을 확인해주세요.')
      onResendSuccess()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '이메일 재발송에 실패했습니다.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>이메일 확인 필요</CardTitle>
        <CardDescription>
          {email}로 전송된 확인 이메일을 클릭해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          회원가입이 완료되었지만, 이메일 확인이 필요합니다. 
          이메일을 확인하고 링크를 클릭한 후 다시 로그인해주세요.
        </p>

        <Button 
          onClick={handleResend} 
          disabled={isResending}
          className="w-full"
        >
          {isResending ? '재발송 중...' : '확인 이메일 재발송'}
        </Button>

        {message && (
          <div className={`text-sm ${message.includes('실패') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
