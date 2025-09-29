import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await hashPassword(password)
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  })
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function validateUser(email: string, password: string) {
  const user = await findUserByEmail(email)
  
  // Supabase Auth를 사용하는 경우 password는 null일 수 있음
  if (!user) {
    return null
  }
  
  // password가 있는 경우에만 검증 (기존 Prisma 방식)
  if (user.password) {
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return null
    }
  }
  
  return user
}
