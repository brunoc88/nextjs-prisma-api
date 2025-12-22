import { prisma } from '@/lib/prisma'
import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { POST } from '@/app/api/user/route'

beforeEach(async () => {
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()
})


const makeReq = (body: any) =>
  new Request('http://localhost/api/user', {
    method: 'POST',
    body: JSON.stringify(body)
  })

describe('POST /api/user', () => {
  it('debe fallar cuando el body está vacío', async () => {
    const res = await POST(makeReq({}))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.errors).toBeDefined()
  })

  it('Debe ingresar un email', async () => {
    const res = await POST(makeReq({
      email: "",
      password: "123456"
    }))

    const json = await res.json()

    expect(json).toHaveProperty('errors')
    expect(json.errors).toHaveProperty('email')
    expect(json.errors.email).toContain('Debe ingresar un email')
  })

  it('Debe ingresar una contraseña', async () => {
    const res = await POST(makeReq({
      email: "bruno@gmail.com",
      password: ""
    }))

    const json = await res.json()

    expect(json).not.toBeNull()
    expect(json).toHaveProperty('errors')
    expect(json.errors.password).toContain('Debe ingresar una contraseña')
    expect(res.status).toBe(400)
  })

  it('Creacion exitosa', async () => {
    const res = await POST(makeReq({
      email: "bruno33@gmail.com",
      password: "123456"
    }))


    const json = await res.json()


    expect(json).not.toBeNull()
    expect(json).toHaveProperty('msj')
    expect(res.status).toBe(201)
  })

  it('Email duplicado', async () => {
    await POST(makeReq({
      email: "bruno33@gmail.com",
      password: "123456"
    }))

    const res = await POST(makeReq({
      email: "bruno33@gmail.com",
      password: "123456"
    }))

    const json = await res.json()

    expect(json).not.toBeNull()
    expect(json).toHaveProperty('error')
    expect(res.status).toBe(409)
    expect(json.error).toBe('El campo email ya está en uso')
  })

  it('Email invalido', async () => {
    const res = await POST(makeReq({
      email: "bruno",
      password: "123456"
    }))

    expect(res.status).toBe(400)

    const json = await res.json()

    expect(json.msj).toBe('Faltan datos')
    expect(json.errors.email).toContain('Email inválido')
  })

})


afterAll(async () => {
  await prisma.$disconnect()
})