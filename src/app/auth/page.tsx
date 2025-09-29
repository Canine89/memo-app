'use client'

import { useState } from 'react'
import { AuthForm } from '@/components/auth-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const handleSuccess = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">메모 앱</h1>
          <p className="text-muted-foreground mt-2">
            간단하고 빠른 메모 관리
          </p>
        </div>

        <AuthForm mode={mode} onSuccess={handleSuccess} />

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {mode === 'login' ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
              </p>
              <Button
                variant="outline"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="w-full"
              >
                {mode === 'login' ? '회원가입' : '로그인'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
