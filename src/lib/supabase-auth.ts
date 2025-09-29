import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name: string | null
}

export async function signUp(email: string, password: string, name?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email,
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  // 이메일 확인 여부 체크
  if (!data.user?.email_confirmed_at) {
    throw new Error('이메일 확인이 필요합니다. 이메일을 확인해주세요.')
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || null,
    }
  } catch (error) {
    console.error('사용자 조회 오류:', error)
    return null
  }
}

export async function getCurrentUserFromServer(): Promise<User | null> {
  try {
    // 서버에서는 쿠키에서 세션을 읽어야 함
    const { createServerClient } = await import('@supabase/ssr')
    const { cookies } = await import('next/headers')
    
    const cookieStore = await cookies()
    
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )
    
    const { data: { user }, error } = await supabaseServer.auth.getUser()
    
    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || null,
    }
  } catch (error) {
    console.error('사용자 조회 오류:', error)
    return null
  }
}

export async function resendConfirmationEmail(email: string) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  })

  if (error) {
    throw new Error(error.message)
  }
}
