import { requireSessionUserId } from "@/lib/auth/requireSessionUserId"
import errorHandler from "@/middleware/errorHandler"
import { postService } from "@/services/post.service"
import { NextResponse } from "next/server"


export const GET = async (req: Request) => {
    try {
        const userId = await requireSessionUserId()

        const res = await postService.findMyPosts(userId)

        return NextResponse.json({blogs:res},{status:200})
    } catch (error) {
        return errorHandler(error)
    }
}