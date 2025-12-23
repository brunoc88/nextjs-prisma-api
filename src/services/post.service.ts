import { PostInputs } from "@/lib/schemas/post.schema"
import { postRepo } from "@/repositories/post.repository"

// Forma adecuada y mas utiliza
// definir objetos tanto en service como repo

export const postService = {
    create : async (data: PostInputs, userId: number) => {

        return await postRepo.create({
            title: data.title,
            content: data.content,
            userId
        })
    },
    update: async(data:PostInputs, postId:number, userId:number) => {

       const post = await postRepo.find(postId)

       if(!post) throw new Error('no encontrado')

       if(post.userId !== userId) throw new Error('sin autorizacion')

       return await postRepo.update(data, postId)
    },
    delete: async(id:number, userId:number) => {
        const post = await postRepo.find(id)
        if(!post) throw new Error('no encontrado')
        
        if(post.userId !== userId) throw new Error('sin autorizacion')
        
        return await postRepo.delete(id)
    }
}
