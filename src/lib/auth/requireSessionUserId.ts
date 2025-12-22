import { getServerSession } from "next-auth"
import { authOptions } from "../../app/api/auth/[...nextauth]/route"

export const requireSessionUserId = async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        throw new Error('sin autorizacion')
    }
    // Convierto a numero
    // Ya que sessio.user.id es un string
    // EN nuestro modelo de prisma id es Int
    const userId = Number(session.user.id) 

    if (Number.isNaN(userId)) { 
        // .isNan() puede devolver falsos true
        // Por eso optamos por Number.isNan()
        throw new Error("ID invalido")
    }

    return userId
}