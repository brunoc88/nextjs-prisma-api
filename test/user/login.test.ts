import { prisma } from '@/lib/prisma'
import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import bcrypt from 'bcryptjs'
import { authorizeUser } from '@/app/api/auth/credentials-authorize'

beforeEach(async () => {
  await prisma.user.deleteMany()

  await prisma.user.create({
    data: {
      email: 'bruno@gmail.com',
      password: await bcrypt.hash('sekrets', 10)
    }
  })
})

// credencials
describe('authorizeUser', () => {
  it('login exitoso', async () => {
    const user = await authorizeUser(
      'bruno@gmail.com',
      'sekrets'
    )

    expect(user).not.toBeNull()
    expect(user?.email).toBe('bruno@gmail.com')
  })

  it('password incorrecta', async () => {
    const user = await authorizeUser(
      'bruno@gmail.com',
      'malpass'
    )

    expect(user).toBeNull()
  })
})


afterAll(async () => {
  await prisma.$disconnect()
})
