const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

async function testAPI() {
  const baseUrl = 'http://localhost:3000'
  
  try {
    console.log('API 엔드포인트를 테스트하는 중...')
    
    // 1. 메모 조회 테스트 (인증 없이)
    console.log('\n1. 메모 조회 테스트 (인증 없이)...')
    const memosResponse = await fetch(`${baseUrl}/api/memos`)
    console.log(`상태 코드: ${memosResponse.status}`)
    
    if (memosResponse.status === 401) {
      console.log('✅ 인증이 필요한 엔드포인트가 올바르게 보호되고 있습니다.')
    }
    
    // 2. 회원가입 테스트
    console.log('\n2. 회원가입 테스트...')
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword123',
        name: '테스트 사용자'
      })
    })
    
    const registerData = await registerResponse.json()
    console.log(`상태 코드: ${registerResponse.status}`)
    console.log(`응답: ${JSON.stringify(registerData, null, 2)}`)
    
    if (registerResponse.ok) {
      console.log('✅ 회원가입이 성공했습니다.')
      
      // 3. 로그인 테스트
      console.log('\n3. 로그인 테스트...')
      const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpassword123'
        })
      })
      
      const loginData = await loginResponse.json()
      console.log(`상태 코드: ${loginResponse.status}`)
      console.log(`응답: ${JSON.stringify(loginData, null, 2)}`)
      
      if (loginResponse.ok) {
        console.log('✅ 로그인이 성공했습니다.')
        
        // 쿠키 추출
        const setCookieHeader = loginResponse.headers.get('set-cookie')
        console.log(`설정된 쿠키: ${setCookieHeader}`)
        
        // 4. 메모 생성 테스트
        console.log('\n4. 메모 생성 테스트...')
        const createMemoResponse = await fetch(`${baseUrl}/api/memos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': setCookieHeader
          },
          body: JSON.stringify({
            title: 'API 테스트 메모',
            content: '이것은 API 테스트를 위해 생성된 메모입니다.'
          })
        })
        
        const createMemoData = await createMemoResponse.json()
        console.log(`상태 코드: ${createMemoResponse.status}`)
        console.log(`응답: ${JSON.stringify(createMemoData, null, 2)}`)
        
        if (createMemoResponse.ok) {
          console.log('✅ 메모 생성이 성공했습니다.')
          
          // 5. 메모 조회 테스트 (인증 후)
          console.log('\n5. 메모 조회 테스트 (인증 후)...')
          const getMemosResponse = await fetch(`${baseUrl}/api/memos`, {
            headers: {
              'Cookie': setCookieHeader
            }
          })
          
          const getMemosData = await getMemosResponse.json()
          console.log(`상태 코드: ${getMemosResponse.status}`)
          console.log(`조회된 메모 수: ${Array.isArray(getMemosData) ? getMemosData.length : 'N/A'}`)
          
          if (getMemosResponse.ok) {
            console.log('✅ 메모 조회가 성공했습니다.')
          }
        }
      }
    }
    
    console.log('\n🎉 모든 API 테스트가 완료되었습니다!')
    
  } catch (error) {
    console.error('❌ API 테스트 오류:', error)
  }
}

testAPI()
