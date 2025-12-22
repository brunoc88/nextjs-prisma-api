// auth/credentials-authorize.ts
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function authorizeUser(
  email: string,
  password: string
) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return null

  return { id: user.id, email: user.email }
}
