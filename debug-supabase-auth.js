// Supabase Auth 디버깅 스크립트
// 브라우저 콘솔에서 실행하세요

// 1. 현재 인증 상태 확인
console.log('=== 현재 인증 상태 ===')
const { data: { user }, error } = await supabase.auth.getUser()
console.log('User:', user)
console.log('Error:', error)

// 2. 세션 확인
console.log('\n=== 현재 세션 ===')
const { data: { session }, error: sessionError } = await supabase.auth.getSession()
console.log('Session:', session)
console.log('Session Error:', sessionError)

// 3. 이메일 확인 상태 확인
if (user) {
  console.log('\n=== 사용자 상세 정보 ===')
  console.log('Email:', user.email)
  console.log('Email Confirmed At:', user.email_confirmed_at)
  console.log('Created At:', user.created_at)
  console.log('Last Sign In:', user.last_sign_in_at)
  console.log('User Metadata:', user.user_metadata)
}

// 4. 로그인 테스트
console.log('\n=== 로그인 테스트 ===')
const testEmail = 'your-email@example.com' // 실제 이메일로 변경
const testPassword = 'your-password' // 실제 비밀번호로 변경

try {
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  })
  
  console.log('Login Data:', loginData)
  console.log('Login Error:', loginError)
} catch (err) {
  console.log('Login Exception:', err)
}
