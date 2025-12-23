import { prisma } from "@/lib/prisma"
import { loadUsers, getUsers } from "../dummyUsers"
import { loadPosts, getPosts } from "../dummyPosts"
import { vi, describe, it, expect, beforeEach, afterAll } from "vitest"
import { getServerSession } from "next-auth"
import { User, Post } from "@/types/types"
import { DELETE } from "@/app/api/posts/[id]/route"

let users: User[]
let posts: Post[]

vi.mock('next-auth', async () => {
    const actual = await vi.importActual<any>('next-auth')
    return {
        ...actual,
        getServerSession: vi.fn()
    }
})

const makeRequest = () => {
    return new Request('http://localhost/', {
        method: 'DELETE'
    })
}

beforeEach(async () => {
    await prisma.post.deleteMany()
    await prisma.user.deleteMany()
    await loadUsers()
    await loadPosts()
    users = await getUsers()
    posts = await getPosts()
})


describe('DELETE', () => {
    it('Eliminar post', async () => {
        (getServerSession as any).mockResolvedValue({
            user: {
                id: users[0].id,
                email: users[0].email
            }
        })

        const res = await DELETE(makeRequest(), { params: { id: String(posts[0].id) } })

        expect(res.status).toBe(200)
    })

    it('Eliminar post no siendo el autor', async () => {
        (getServerSession as any).mockResolvedValue({
            user: {
                id: users[1].id,
                email: users[1].email
            }
        })

        const res = await DELETE(makeRequest(), { params: { id: String(posts[0].id) } })

        expect(res.status).toBe(401)
    })
})

afterAll(async () => {
    await prisma.$disconnect()
})