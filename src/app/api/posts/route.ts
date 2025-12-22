import { postSchema } from "@/lib/schemas/post.schema"
import errorHandler from "@/middleware/errorHandler"
import { requireSessionUserId } from "@/lib/auth/requireSessionUserId"
import { NextResponse } from "next/server"
import { postService } from "@/services/post.service"

export const POST = async (req: Request) => {
    try {
        const userId = await requireSessionUserId()

        const body = await req.json()

        const parsed = await postSchema.safeParseAsync(body)
        if (!parsed.success) {
            return NextResponse.json({
                errors: parsed.error.flatten().fieldErrors
            },{ status: 400 })
        }

        const post = await postService.create(parsed.data, userId)

        return NextResponse.json({msj:'Posteo realizado', post},{status:201})

    } catch (error) {
        return errorHandler(error)
    }
}