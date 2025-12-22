import { PrismaClient } from "@prisma/client"

const globalPrimsa = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalPrimsa.prisma || new PrismaClient({
    log: ["query"],
})

if (process.env.NODE_ENV !== "production") globalPrimsa.prisma = prisma