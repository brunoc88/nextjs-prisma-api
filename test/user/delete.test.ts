import { describe, it, expect, beforeEach, afterAll } from "vitest"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getServerSession } from 'next-auth'
import { vi } from "vitest"
import { DELETE } from "@/app/api/user/route"



vi.mock('next-auth', async () => {
    const actual = await vi.importActual<any>('next-auth')
    return {
        ...actual,
        getServerSession: vi.fn()
    }
})

let dbUser: { id: number, email: string }

const makeReq = () => new Request('http://localhost/api/user', {
    method: 'DELETE'
})

beforeEach(async () => {
    await prisma.post.deleteMany()
    await prisma.user.deleteMany()
    

    const created = await prisma.user.create({
        data: {
            email: 'bruno@gmail.com',
            password: await bcrypt.hash('sekrets', 10)
        }
    })

    dbUser = {
        id: created.id,
        email: created.email
    }
})

describe('DELETE', () => {
    it('Eliminar cuenta', async () => {
        (getServerSession as any).mockResolvedValue({
            user: {
                id: dbUser.id,
                email: dbUser.email
            }
        })

        const res = await DELETE(makeReq())
        const json = await res?.json()

        expect(json).toHaveProperty('msj')
        expect(json.msj).toBe('cuenta eliminada')
        expect(res?.status).toBe(200)
    })
})

afterAll(async () => {
    await prisma.$disconnect()
})