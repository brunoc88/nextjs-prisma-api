import {prisma} from "@/lib/prisma"

export const postRepo = {
    create: async (data: {title:string, content:string, userId:number}) => {
        return await prisma.post.create({data})
    },

    find:async(id:number)=>{
        return await prisma.post.findUnique({where:{id}})
    },

    update: async (data:{title:string, content:string}, postId:number) => {
        return await prisma.post.update({data,where:{id:postId}})
    },

    delete: async (id:number) => {
        return await prisma.post.delete({where:{id}})
    },

    findAll: async () => {
        return await prisma.post.findMany({
            include:{
                user:true
            }
        })
    }

    
}