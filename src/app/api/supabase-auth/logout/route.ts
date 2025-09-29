import { NextResponse } from 'next/server'
import { signOut } from '@/lib/supabase-auth'

export async function POST() {
  try {
    await signOut()

    return NextResponse.json(
      { message: '로그아웃되었습니다.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('로그아웃 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
