const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testRLS() {
  try {
    console.log('🔒 RLS (Row Level Security) 테스트를 시작합니다...\n')

    // 1. 인증 없이 데이터 조회 시도
    console.log('1. 인증 없이 메모 조회 시도...')
    const { data: memosWithoutAuth, error: memosError } = await supabase
      .from('memos')
      .select('*')
    
    if (memosError) {
      console.log(`❌ 예상된 오류: ${memosError.message}`)
    } else {
      console.log(`✅ 데이터 조회됨: ${memosWithoutAuth?.length || 0}개`)
    }

    // 2. 인증 없이 사용자 조회 시도
    console.log('\n2. 인증 없이 사용자 조회 시도...')
    const { data: usersWithoutAuth, error: usersError } = await supabase
      .from('users')
      .select('*')
    
    if (usersError) {
      console.log(`❌ 예상된 오류: ${usersError.message}`)
    } else {
      console.log(`✅ 데이터 조회됨: ${usersWithoutAuth?.length || 0}개`)
    }

    // 3. 테스트 사용자로 로그인
    console.log('\n3. 테스트 사용자로 로그인...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword123'
    })

    if (authError) {
      console.log(`❌ 로그인 실패: ${authError.message}`)
      return
    }

    console.log(`✅ 로그인 성공: ${authData.user?.email}`)

    // 4. 인증 후 메모 조회
    console.log('\n4. 인증 후 메모 조회...')
    const { data: memosWithAuth, error: memosAuthError } = await supabase
      .from('memos')
      .select('*')
      .order('updated_at', { ascending: false })
    
    if (memosAuthError) {
      console.log(`❌ 메모 조회 오류: ${memosAuthError.message}`)
    } else {
      console.log(`✅ 메모 조회 성공: ${memosWithAuth?.length || 0}개`)
      memosWithAuth?.forEach(memo => {
        console.log(`   - ${memo.title} (${memo.user_id})`)
      })
    }

    // 5. 인증 후 사용자 정보 조회
    console.log('\n5. 인증 후 사용자 정보 조회...')
    const { data: userWithAuth, error: userAuthError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user?.id)
      .single()
    
    if (userAuthError) {
      console.log(`❌ 사용자 조회 오류: ${userAuthError.message}`)
    } else {
      console.log(`✅ 사용자 조회 성공: ${userWithAuth?.email}`)
    }

    // 6. 새 메모 생성 테스트
    console.log('\n6. 새 메모 생성 테스트...')
    const { data: newMemo, error: createError } = await supabase
      .from('memos')
      .insert({
        title: 'RLS 테스트 메모',
        content: '이것은 RLS 테스트를 위해 생성된 메모입니다.',
        user_id: authData.user?.id
      })
      .select()
      .single()
    
    if (createError) {
      console.log(`❌ 메모 생성 오류: ${createError.message}`)
    } else {
      console.log(`✅ 메모 생성 성공: ${newMemo.title}`)
    }

    // 7. 다른 사용자의 메모에 접근 시도 (실제로는 불가능해야 함)
    console.log('\n7. 다른 사용자의 메모 접근 시도...')
    const { data: otherMemos, error: otherError } = await supabase
      .from('memos')
      .select('*')
      .neq('user_id', authData.user?.id)
    
    if (otherError) {
      console.log(`❌ 예상된 오류: ${otherError.message}`)
    } else {
      console.log(`✅ 다른 사용자 메모 조회됨: ${otherMemos?.length || 0}개`)
      if (otherMemos && otherMemos.length > 0) {
        console.log('⚠️  RLS가 제대로 작동하지 않을 수 있습니다!')
      }
    }

    console.log('\n🎉 RLS 테스트가 완료되었습니다!')

  } catch (error) {
    console.error('❌ 테스트 오류:', error)
  } finally {
    // 로그아웃
    await supabase.auth.signOut()
  }
}

testRLS()
