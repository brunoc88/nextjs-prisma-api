import {prisma} from "@/lib/prisma"

export const postRepo = {
    create: async (data: {title:string, content:string, userId:number}) => {
        return await prisma.post.create({data})
    }
}