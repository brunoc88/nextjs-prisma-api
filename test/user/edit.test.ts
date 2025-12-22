import { describe, it, expect, beforeEach, afterAll } from "vitest"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getServerSession } from 'next-auth'
import { vi } from "vitest"
import { PUT } from "@/app/api/user/route"


vi.mock('next-auth', async () => {
    const actual = await vi.importActual<any>('next-auth')
    return {
        ...actual,
        getServerSession: vi.fn()
    }
})

let dbUser: { id: number, email: string }

const makeReq = (body: { email?: string, password?: string }) => new Request('http://localhost/api/user', {
    method: 'PUT',
    body: JSON.stringify(body)
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


describe('PUT', () => {
    it('actualiza datos con sesión válida', async () => {
        (getServerSession as any).mockResolvedValue({
            user: {
                id: dbUser.id,
                email: dbUser.email
            }
        })

        const res: any = await PUT(makeReq({
            email: "nuevo@gmail.com"
        }))
        const json = await res.json()

        expect(res.status).toBe(200)
        expect(json.user.email).toBe('nuevo@gmail.com')
    })

    it('rechaza si no hay sesión', async () => {
        (getServerSession as any).mockResolvedValue(null)


        const res: any = await PUT(makeReq({ email: 'x@gmail.com' }))

        expect(res.status).toBe(401)
    })

})

afterAll(async () => {
    await prisma.$disconnect()
})