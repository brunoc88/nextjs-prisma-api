import { UserInputs } from "@/lib/schemas/user.schema"
import * as userRepo from "@/repositories/user.repository"
import bcrypt from "bcryptjs"

export const createUserService = async (data: UserInputs) => {

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await userRepo.createUser({
        ...data, //<-- para sobre escribir si hay coincidencia de propiedades
        password: hashedPassword // paso el password hasheado
    })
    return user
}

export const updateUserService = async (
    userId: number,
    data: { email?: string; password?: string }
) => {
    const updateData: { email?: string; password?: string } = {}

    if (data.email) updateData.email = data.email
    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10)
    }

    return userRepo.updateUser(userId, updateData)
}

export const deleteUserServices = async (userId:number) => {
    return userRepo.deleteUser(userId)
}