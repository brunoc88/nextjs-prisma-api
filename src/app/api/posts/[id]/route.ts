import errorHandler from "@/middleware/errorHandler"
import { postSchema } from "@/lib/schemas/post.schema"
import { requireSessionUserId } from "@/lib/auth/requireSessionUserId"
import { NextResponse } from "next/server"
import { postService } from "@/services/post.service"

export const PUT = async (req: Request, context:{params:Promise<{ id: string }>}) => {
    try {

        const userId = await requireSessionUserId()

        let {id} = await context.params
        const postId = Number(id)
 
        const body = await req.json()

        const parsed = await postSchema.safeParseAsync(body)
        if (!parsed.success) {
            return NextResponse.json({
                errors: parsed.error.flatten().fieldErrors
            }, { status: 400 })
        }

        const post = await postService.update(parsed.data, postId, userId)

        return NextResponse.json({ msj: 'Post actualizado', post }, { status: 200 })
    } catch (error) {
        return errorHandler(error)
    }
}

export const DELETE = async (
  req: Request,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await context.params

    const userId = await requireSessionUserId()
    const postId = Number(id)

    if (Number.isNaN(postId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      )
    }

    await postService.delete(postId, userId)

    return NextResponse.json(
      { msj: "Post eliminado" },
      { status: 200 }
    )
  } catch (error) {
    return errorHandler(error)
  }
}

export const GET = async (req:Request, context:{params:Promise<{ id: string }>}) =>{
  try {
    await requireSessionUserId()

    const { id } = await context.params
    const postId = Number(id)

    const res = await postService.findPost(postId)

    return NextResponse.json({post:res},{status:200})

  } catch (error) {
    return errorHandler(error)
  }
}