import { prisma } from "@/lib/prisma"
import { loadUsers, getUsers } from "../dummyUsers"
import { loadPosts, getPosts } from "../dummyPosts"
import { getServerSession } from "next-auth"
import { vi, describe, it, expect, beforeEach, afterEach, afterAll } from "vitest"
import { Post, User } from "@/types/types"
import { GET } from "@/app/api/posts/route"

let posts: Post[]
let users: User[]

const makeRequest = () => {
    return new Request('http://localhost/', {
        method: 'GET'
    })
}

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
    users  = await getUsers()
    posts = await getPosts()
})

describe('GET', () => {
    it('Obtener todos los post', async () => {
        (getServerSession as any).mockResolvedValue({
            user:{
                id: users[0].id,
                email: users[0].email
            }
        })

        const res = await GET(makeRequest())

        const body = await res.json()

        expect(res.status).toBe(200)
        expect(body).toHaveProperty('blogs')
        expect(body.blogs).not.toBeNull()
        expect(body.blogs).toHaveLength(1)
    })

    it('Obtener los post sin session', async () => {
        (getServerSession as any).mockResolvedValue(null)

        const res = await GET(makeRequest())

        expect(res.status).toBe(401)
    })
})

afterAll(async() => {
    await prisma.$disconnect()
})