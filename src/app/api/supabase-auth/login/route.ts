import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/lib/supabase-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    console.log('로그인 시도:', { email })

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호는 필수입니다.' },
        { status: 400 }
      )
    }

    const data = await signIn(email, password)
    console.log('로그인 성공:', { userId: data.user?.id, email: data.user?.email })

    return NextResponse.json(
      { 
        message: '로그인 성공',
        user: {
          id: data.user?.id,
          email: data.user?.email,
          name: data.user?.user_metadata?.name,
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('로그인 오류:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
