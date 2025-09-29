const { PrismaClient: SQLiteClient } = require('../node_modules/.prisma/sqlite-client')
const { PrismaClient: SupabaseClient } = require('@prisma/client')
const fs = require('fs')

// SQLite에서 데이터 읽기
const sqliteClient = new SQLiteClient()

// Supabase (PostgreSQL) 클라이언트
const supabaseClient = new SupabaseClient()

async function migrateData() {
  try {
    console.log('SQLite에서 데이터를 읽는 중...')
    
    // SQLite에서 사용자와 메모 데이터 읽기
    const users = await sqliteClient.user.findMany({
      include: {
        memos: true
      }
    })
    
    console.log(`총 ${users.length}명의 사용자와 ${users.reduce((acc, user) => acc + user.memos.length, 0)}개의 메모를 찾았습니다.`)
    
    if (users.length === 0) {
      console.log('마이그레이션할 데이터가 없습니다.')
      return
    }
    
    console.log('Supabase로 데이터를 마이그레이션하는 중...')
    
    // 사용자 데이터 마이그레이션
    for (const user of users) {
      console.log(`사용자 마이그레이션 중: ${user.email}`)
      
      // 사용자 생성
      const newUser = await supabaseClient.user.create({
        data: {
          id: user.id,
          email: user.email,
          password: user.password,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      })
      
      console.log(`사용자 생성 완료: ${newUser.email}`)
      
      // 해당 사용자의 메모들 마이그레이션
      for (const memo of user.memos) {
        console.log(`메모 마이그레이션 중: ${memo.title}`)
        
        await supabaseClient.memo.create({
          data: {
            id: memo.id,
            title: memo.title,
            content: memo.content,
            userId: memo.userId,
            createdAt: memo.createdAt,
            updatedAt: memo.updatedAt
          }
        })
        
        console.log(`메모 생성 완료: ${memo.title}`)
      }
    }
    
    console.log('마이그레이션이 완료되었습니다!')
    
    // 마이그레이션 결과 확인
    const migratedUsers = await supabaseClient.user.count()
    const migratedMemos = await supabaseClient.memo.count()
    
    console.log(`마이그레이션 결과:`)
    console.log(`- 사용자: ${migratedUsers}명`)
    console.log(`- 메모: ${migratedMemos}개`)
    
  } catch (error) {
    console.error('마이그레이션 오류:', error)
  } finally {
    await sqliteClient.$disconnect()
    await supabaseClient.$disconnect()
  }
}

migrateData()
