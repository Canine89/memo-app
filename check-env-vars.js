// 환경 변수 확인 스크립트
// 브라우저 콘솔에서 실행하세요

console.log('=== 환경 변수 확인 ===')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '설정됨' : '설정 안됨')

// Supabase 클라이언트 초기화 테스트
try {
  const { createClient } = await import('@supabase/supabase-js')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase 환경 변수가 설정되지 않았습니다!')
  } else {
    console.log('✅ Supabase 환경 변수가 설정되어 있습니다.')
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // 연결 테스트
    const { data, error } = await supabase.auth.getSession()
    console.log('Supabase 연결 테스트:', error ? '실패' : '성공')
    if (error) console.error('연결 오류:', error)
  }
} catch (err) {
  console.error('Supabase 클라이언트 초기화 오류:', err)
}
