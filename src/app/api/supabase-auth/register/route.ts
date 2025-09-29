import { NextRequest, NextResponse } from 'next/server'
import { signUp } from '@/lib/supabase-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호는 필수입니다.' },
        { status: 400 }
      )
    }

    const data = await signUp(email, password, name)

    return NextResponse.json(
      { 
        message: '회원가입이 완료되었습니다.',
        needsEmailConfirmation: !data.user?.email_confirmed_at,
        user: {
          id: data.user?.id,
          email: data.user?.email,
          name: data.user?.user_metadata?.name,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('회원가입 오류:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
