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
    }
}
