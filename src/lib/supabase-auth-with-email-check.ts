import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name: string | null
  emailConfirmed: boolean
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

  return {
    ...data,
    needsEmailConfirmation: !data.user?.email_confirmed_at
  }
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
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name || null,
    emailConfirmed: !!user.email_confirmed_at,
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
