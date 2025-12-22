import { prisma } from "@/lib/prisma";

export const createUser = async (data: { email: string; password: string }) => {
  try {
    const userCreated = await prisma.user.create({ data })
    return userCreated
  } catch (error: any) {
    throw error // lo atrapa el errorHandler final en la API
  }
}

export const updateUser = async (userId:number, data:{email?:string, password?:string}) => {
  try {
    const updateUser = await prisma.user.update({where:{id:userId}, data})
    return updateUser
  } catch (error:any) {
    throw error
  }
}

export const deleteUser = async (userId:number) => {
  try {
    const deleteUser = await prisma.user.delete({where:{id:userId}})
    return deleteUser
  } catch (error) {
    throw error
  }
}
