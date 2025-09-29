'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setMessage('인증 처리 중 오류가 발생했습니다.')
          return
        }

        if (data.session?.user) {
          setStatus('success')
          setMessage('이메일 확인이 완료되었습니다! 로그인 중...')
          
          // 2초 후 메인 페이지로 리다이렉트
          setTimeout(() => {
            window.location.href = '/'
          }, 2000)
        } else {
          setStatus('error')
          setMessage('세션을 찾을 수 없습니다.')
        }
      } catch (err) {
        console.error('Auth callback exception:', err)
        setStatus('error')
        setMessage('예상치 못한 오류가 발생했습니다.')
      }
    }

    handleAuthCallback()
  }, [])

  const handleRetry = () => {
    window.location.href = '/auth'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {status === 'loading' && '이메일 확인 중...'}
            {status === 'success' && '이메일 확인 완료'}
            {status === 'error' && '오류 발생'}
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'loading' && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          
          {status === 'error' && (
            <Button onClick={handleRetry} className="w-full">
              다시 시도
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
