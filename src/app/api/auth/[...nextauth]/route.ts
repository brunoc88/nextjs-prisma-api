import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { UserSchema } from "@/lib/schemas/user.schema"
import {prisma} from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' }
            },
            async authorize(credentials) {
                const parsed = await UserSchema.safeParseAsync(credentials)
                if (!parsed.success) return null

                const user = await prisma.user.findUnique({
                    where: { email: parsed.data.email }
                })
                if(!user) return null

                const isValid = await bcrypt.compare(parsed.data.password, user.password)
                if(!isValid) return null
                
                return {id:user.id, email:user.email}
            }

        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
            }
            return token
        },
        async session({ session, token }) {
            if (!session.user) session.user = {} as any
            session.user.id = token.id
            session.user.email = token.email
            return session
        }
    }

}

// Export del handler de NextAuth con los métodos HTTP requeridos por App Router
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }