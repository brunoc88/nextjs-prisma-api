import { NextResponse } from "next/server"
import { EditUserSchema, UserSchema } from "@/lib/schemas/user.schema"
import { createUserService, deleteUserServices, updateUserService } from "@/services/user.service"
import errorHandler from "@/middleware/errorHandler"
import { requireSessionUserId } from "@/lib/auth/requireSessionUserId"

export const POST = async (req: Request) => {
  try {
    const body = await req.json()

    const parsed = await UserSchema.safeParseAsync(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          msj: "Faltan datos",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const user = await createUserService(parsed.data)

    return NextResponse.json(
      { msj: "usuario creado", user: { id: user.id, email: user.email } },
      { status: 201 }
    )
  } catch (error: any) {
    return errorHandler(error)
  }
}

export const PUT = async (req: Request) => {
  try {

    const userId = await requireSessionUserId()

    const data = await req.json()
    const parsed = EditUserSchema.safeParse(data)

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const user = await updateUserService(userId, parsed.data)

    return NextResponse.json(
      { msj: "Datos actualizados", user: { id: user.id, email: user.email } },
      { status: 200 }
    )
  } catch (error: any) {
    return errorHandler(error)
  }


}

export const DELETE = async (req: Request) => {
  try {
    const userId = await requireSessionUserId()

    await deleteUserServices(userId)

    return NextResponse.json({ msj: 'cuenta eliminada' }, { status: 200 })
  } catch (error) {
    errorHandler(error)
  }
}