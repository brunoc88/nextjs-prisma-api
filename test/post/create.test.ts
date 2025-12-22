import { describe, it, expect, beforeEach, afterAll } from "vitest"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { POST } from "@/app/api/posts/route"
import { getServerSession } from 'next-auth'
import {vi} from "vitest"

let dbUser: { id: number, email: string }
let url:string = 'http://localhost/api/post'

vi.mock('next-auth', async () =>{
    const actual = await vi.importActual<any>('next-auth')
    return {
        ...actual,
        getServerSession:vi.fn()
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

const makeRequest = (body:{title:string, content:string}) => {
    return new Request(url,{
        method:'POST',
        body:JSON.stringify(body)
    })
}


describe('POST', () => {
    it('Hacer un posteo exitoso', async () =>{

        // mockeamos inicio de session exitosa
          (getServerSession as any).mockResolvedValue({
                    user: {
                        id: dbUser.id,
                        email: dbUser.email
                    }
                })
        
        const res = await POST(makeRequest({
            title:'Tratando de entender prisma',
            content: 'Se que es muy dificil pero lo entendere'
        }))

        const body = await res.json()

        expect(res.status).toBe(201)
        expect(body).toHaveProperty('msj')
        expect(body.msj).toBe('Posteo realizado')
        expect(body).toHaveProperty('post')
        expect(body.post.title).toBe('tratando de entender prisma')
    })
})

afterAll(async() => {
    await prisma.$disconnect()
})


