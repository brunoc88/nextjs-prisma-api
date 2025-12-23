import { describe, it, expect, beforeEach, afterAll } from "vitest"
import { prisma } from "@/lib/prisma"
import { getServerSession } from 'next-auth'
import { vi } from "vitest"
import { getUsers, loadUsers } from "../dummyUsers"
import { User, Post } from "@/types/types"
import { getPosts, loadPosts } from "../dummyPosts"
import { PUT } from "@/app/api/posts/[id]/route"

let users: User[]
let posts: Post[]
let url: string = 'http://localhost/'

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

    await loadUsers()
    await loadPosts()
    users = await getUsers()
    posts = await getPosts()
})

const makeRequest = (body: { title: string, content: string }) => {
    return new Request(url, {
        method: 'PUT',
        body: JSON.stringify(body)
    })
}

describe('PUT', () => {
    describe('Editar post', () => {
        it('Post con exito', async () => {
            (getServerSession as any).mockResolvedValue({
                user: {
                    id: users[0].id,
                    email: users[0].email
                }
            })

            const post = posts[0]

            const titleBefore = post.title

            const res = await PUT(
                makeRequest({
                    title: 'No hay requiem',
                    content: post.content
                }),
                {
                    params: {
                        id: String(post.id)
                    }
                }
            )

            const body = await res.json()

            expect(res.status).toBe(200)
            expect(body.post.title).toBe('no hay requiem')
            expect(body.post.title).not.toBe(titleBefore)
        })

        it('Usando id diferente al autor', async () => {
            (getServerSession as any).mockResolvedValue({
                user: {
                    id: users[1].id,
                    email: users[1].email
                }
            })

            const post = posts[0]

            const res = await PUT(
                makeRequest({
                    title: 'No hay requiem',
                    content: post.content
                }),
                {
                    params: {
                        id: String(post.id)
                    }
                }
            )

            const body = await res.json()

            expect(res.status).toBe(401)
            expect(body).toHaveProperty('error')
            expect(body.error).toBe('Sin autorización')

        })

        it('Usando id diferente al autor', async () => {
            (getServerSession as any).mockResolvedValue({
                user: {
                    id: users[1].id,
                    email: users[1].email
                }
            })

            const post = posts[0]

            const res = await PUT(
                makeRequest({
                    title: 'No hay requiem',
                    content: post.content
                }),
                {
                    params: {
                        id: String(999)
                    }
                }
            )

            const body = await res.json()

            expect(res.status).toBe(404)
            expect(body).toHaveProperty('error')
            expect(body.error).toBe('No encontrado')

        })
    })
})

afterAll(async () => {
    await prisma.$disconnect()
})
