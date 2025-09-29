const { PrismaClient } = require('@prisma/client')

// SQLite 데이터베이스에서 데이터 추출
const sqliteClient = new PrismaClient({
  datasources: {
    db: {
      url: "file:./dev.db"
    }
  }
})

async function exportData() {
  try {
    console.log('SQLite 데이터베이스에서 데이터를 추출 중...')
    
    const users = await sqliteClient.user.findMany({
      include: {
        memos: true
      }
    })
    
    console.log(`총 ${users.length}명의 사용자와 ${users.reduce((acc, user) => acc + user.memos.length, 0)}개의 메모를 찾았습니다.`)
    
    // JSON 파일로 저장
    const fs = require('fs')
    const path = require('path')
    
    const exportData = {
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        memos: user.memos.map(memo => ({
          id: memo.id,
          title: memo.title,
          content: memo.content,
          userId: memo.userId,
          createdAt: memo.createdAt,
          updatedAt: memo.updatedAt
        }))
      }))
    }
    
    fs.writeFileSync('data-export.json', JSON.stringify(exportData, null, 2))
    console.log('데이터가 data-export.json 파일로 저장되었습니다.')
    
  } catch (error) {
    console.error('데이터 추출 오류:', error)
  } finally {
    await sqliteClient.$disconnect()
  }
}

exportData()
