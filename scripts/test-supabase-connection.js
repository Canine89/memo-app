const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Supabase 연결을 테스트하는 중...')
    
    // 사용자 수 조회
    const userCount = await prisma.user.count()
    console.log(`총 사용자 수: ${userCount}명`)
    
    // 메모 수 조회
    const memoCount = await prisma.memo.count()
    console.log(`총 메모 수: ${memoCount}개`)
    
    // 최근 사용자 조회
    const recentUsers = await prisma.user.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })
    
    console.log('\n최근 사용자:')
    recentUsers.forEach(user => {
      console.log(`- ${user.email} (${user.name || '이름 없음'}) - ${user.createdAt.toLocaleDateString()}`)
    })
    
    // 최근 메모 조회
    const recentMemos = await prisma.memo.findMany({
      take: 3,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        updatedAt: true,
        user: {
          select: {
            email: true
          }
        }
      }
    })
    
    console.log('\n최근 메모:')
    recentMemos.forEach(memo => {
      console.log(`- ${memo.title} (${memo.user.email}) - ${memo.updatedAt.toLocaleDateString()}`)
    })
    
    console.log('\n✅ Supabase 연결이 정상적으로 작동합니다!')
    
  } catch (error) {
    console.error('❌ Supabase 연결 오류:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
