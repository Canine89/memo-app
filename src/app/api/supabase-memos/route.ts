import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getCurrentUserFromServer } from '@/lib/supabase-auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserFromServer()

    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    // RLS가 활성화되어 있으므로 사용자 ID로 필터링할 필요 없음
    const { data: memos, error } = await supabase
      .from('memos')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(memos)
  } catch (error) {
    console.error('메모 조회 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserFromServer()

    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const { title, content } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: '제목은 필수입니다.' },
        { status: 400 }
      )
    }

    const { data: memo, error } = await supabase
      .from('memos')
      .insert({
        title,
        content: content || '',
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(memo, { status: 201 })
  } catch (error) {
    console.error('메모 생성 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
