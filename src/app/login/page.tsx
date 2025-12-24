"use client"

import { signIn } from "next-auth/react"
import React, { useState } from "react"
import { UserSchema } from "@/lib/schemas/user.schema"
import { useRouter } from "next/navigation"

const LoginPage = () => {
    const router = useRouter() 
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string[]>([])


    const handleLogin = async (e: React.FormEvent) => {

        e.preventDefault()

        setError([])

        const parsed = UserSchema.safeParse({ email, password })

        if (!parsed.success) {
            const errors = parsed.error.flatten().fieldErrors
            setError([
                // operador spread es para aplanar todos los arrays de erros en uno!.
                ...(errors.email ?? []),
                ...(errors.password ?? [])
            ])
            setEmail("")
            setPassword("")
            return
        }

        const res = await signIn('credentials', {
            email,
            password,
            // por defecto es true, al hacerlo false no nos redirige si falla el login
            redirect: false,
            callbackUrl:'/home'
        })

        if (res?.error) {
            setError(['Credenciales inválidas'])
        }

        // redirijo manualmente
        if (res?.ok) {
           router.push(res.url ?? "/home")
        }
    }


    return (
        <>
            <h1>Loguin</h1>
            <form onSubmit={handleLogin}>
                <div>
                    {error.length > 0 && (
                        <ul style={{ color: 'red' }}>
                            {error.map((v, i) => (
                                <li key={i}>{v}</li>
                            ))}
                        </ul>
                    )}

                </div>
                <div>
                    Email:
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Ingrese su email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />

                </div>
                <div>
                    Password:
                    <input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <div>
                    <button type="submit">LogIn</button>
                </div>
            </form>
        </>
    )
}

export default LoginPage