import { describe, it, expect, beforeEach, afterAll } from "vitest"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { POST } from "@/app/api/posts/route"
import { getServerSession } from 'next-auth'
import { vi } from "vitest"

let dbUser: { id: number, email: string }
let url: string = 'http://localhost/api/post'

vi.mock('next-auth', async () => {
    const actual = await vi.importActual<any>('next-auth')
    return {
        ...actual,
        getServerSession: vi.fn()
    }
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

const makeRequest = (body: { title: string, content: string }) => {
    return new Request(url, {
        method: 'POST',
        body: JSON.stringify(body)
    })
}


describe('POST', () => {

    describe("Mandar formulario", () => {
        it('Hacer un posteo exitoso', async () => {

            // mockeamos inicio de session exitosa
            // aqui nos devuelve session
            // Marcando que el user esta autenticado
            (getServerSession as any).mockResolvedValue({
                user: {
                    id: dbUser.id,
                    email: dbUser.email
                }
            })

            const res = await POST(makeRequest({
                title: 'Tratando de entender prisma',
                content: 'Se que es muy dificil pero lo entendere'
            }))

            const body = await res.json()

            expect(res.status).toBe(201)
            expect(body).toHaveProperty('msj')
            expect(body.msj).toBe('Posteo realizado')
            expect(body).toHaveProperty('post')
            expect(body.post.title).toBe('tratando de entender prisma')
        })

        it('Formulario vacio', async () => {
            (getServerSession as any).mockResolvedValue({
                user: {
                    id: dbUser.id,
                    email: dbUser.email
                }
            })

            const res = await POST(makeRequest({
                title: "",
                content: ""
            }))


            const body = await res.json()


            expect(body).not.toBeNull()
            expect(body).toHaveProperty("errors")
            expect(body.errors.title).toContain("Debe ingresar un titulo")
            expect(body.errors.content).toContain("Debe ingresar el contenido")
            expect(res.status).toBe(400)
        })

        it("sin loguearse", async () => {
            (getServerSession as any).mockResolvedValue(null)

            const res = await POST(makeRequest({
                title: "Resident evil requiem",
                content: "Lo nuevo de la saga para el 2026"
            }))

            const body = await res.json()

            console.log(body)
            expect(res.status).toBe(401)
            expect(body).toHaveProperty("error")
            expect(body.error).toBe("Sin autorización")
        })

        it("titulo menor a 5 caracteres", async () => {
            (getServerSession as any).mockResolvedValue({          
                user:{
                    id:dbUser.id,
                    email: dbUser.email
                }
            })

            const res = await POST(makeRequest({
                title:"a",
                content:"Lo nuevo para 2026"
            }))

            const body = await res.json()

            expect(res.status).toBe(400)
            expect(body).toHaveProperty('errors')
            expect(body.errors).toHaveProperty('title')
            expect(body.errors.title).toContain('Min 5 caracteres')
        })

    })

})

afterAll(async () => {
    await prisma.$disconnect()
})


