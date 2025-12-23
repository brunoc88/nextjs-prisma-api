import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const loadUsers = async () => {
    let hashedPassword: string = await bcrypt.hash('sekret', 10)

    await prisma.$transaction([
        prisma.user.create({data: {
            email: "bruno@gmail.com",
            password: hashedPassword
        }}),
        prisma.user.create({
        data: {
            email: "pepe10@gmail.com",
            password: hashedPassword
        }
    })])
}


export const getUsers = async () => {
  return await prisma.user.findMany({
    // Mas seguro usar select porque no traemos el password
    // Si usaramos map el password ya vendria por default
    select: {
      id: true,
      email: true
    }
  })
}



