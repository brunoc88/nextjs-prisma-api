import errorHandler from "@/middleware/errorHandler"
import { postSchema } from "@/lib/schemas/post.schema"
import { requireSessionUserId } from "@/lib/auth/requireSessionUserId"
import { NextResponse } from "next/server"
import { postService } from "@/services/post.service"

export const PUT = async (req: Request, {params}: { params:{id: string }}) => {
    try {

        const userId = await requireSessionUserId()

        const id = Number(params.id)
        if (Number.isNaN(id)) {
            throw new Error('ID inválido')
        }

        const body = await req.json()

        const parsed = await postSchema.safeParseAsync(body)
        if (!parsed.success) {
            return NextResponse.json({
                errors: parsed.error.flatten().fieldErrors
            }, { status: 400 })
        }

        const post = await postService.update(parsed.data, id, userId)

        return NextResponse.json({ msj: 'Post actualizado', post }, { status: 200 })
    } catch (error) {
        return errorHandler(error)
    }
}

export const DELETE = async (req:Request, {params}: {params:{id:string}}) => {
    try {
        const userId = await requireSessionUserId()

        const id = Number(params.id)
        if(Number.isNaN(id)) {
            throw new Error('ID inválido')
        }

        await postService.delete(id, userId)

        return NextResponse.json({msj:'Post eliminado'},{status:200})
    } catch (error) {
        return errorHandler(error)
    }
}