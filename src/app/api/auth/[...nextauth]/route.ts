import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { authorizeUser } from "../credentials-authorize"

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null
                return authorizeUser(credentials.email, credentials.password)
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