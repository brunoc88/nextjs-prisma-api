import { prisma } from "@/lib/prisma"
import { getUsers } from "./dummyUsers"
import { User } from "@/types/types"

export const loadPosts = async() => {
    let users:User[] = await getUsers()

    await prisma.post.create({data:{
        title:'Resident Evil requiem',
        content:'Lo nuevo de capcom para 2026',
        userId: users[0].id
    }})
}

export const getPosts = async () => {
    return await prisma.post.findMany()
}