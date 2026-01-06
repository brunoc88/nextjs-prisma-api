"use client"

import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { handlePost, handlePut } from "./handleSubmit"
import { useRouter } from "next/navigation"
import { signIn, signOut } from "next-auth/react"


const UserForm = () => {
    const { data: session } = useSession()
    const [user, setUser] = useState<{ email: string, password: string }>({ email: "", password: "" })
    const [error, setError] = useState<string[]>([])
    const [editPassword, setEditPassword] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        if (!session?.user?.email) return

        setUser({
            email: session.user.email,
            password: ""
        })
    }, [session])


    const handleUser = (e: any) => {
        const { name, value } = e.target
        setUser(prev => (
            { ...prev, [name]: value }
        ))
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError([])

        try {
            if (!session) {
                const res = await handlePost(user)
                if (res?.errors) {
                    setError(Object.values(res.errors).flat())
                    return
                }
                signIn('credentials', {
                    email: user.email,
                    password: user.password,
                    callbackUrl: '/home'
                })

            } else {
                let res;
                if (!user.password || user.password.length === 0) res = await handlePut({ email: user.email })
                else res = await handlePut(user)
                
                if (res?.errors) {
                    setError(Object.values(res.errors).flat())
                    return
                }
                router.push('/home')
            }
        } catch (err: any) {
            setError([err.message]) // errores del servidor
        }
    }

    const handleBack = (e: React.FormEvent) => {
        e.preventDefault()
        router.push('/login')
    }

    return (
        <>
            {session ? (
                <h2>Formulario de edición</h2>
            ) : (
                <h2>Formulario de registro</h2>
            )}

            <>
                {error.map((e, i) => (
                    <ul style={{ color: 'red' }}>
                        <li key={i}>
                            {e}
                        </li>
                    </ul>
                ))}
                <form onSubmit={handleSubmit}>
                    <div>
                        email:
                        <input
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleUser}
                            value={user.email}
                        />
                    </div>

                    {(!session || editPassword) && (
                        <div>
                            password:
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={user.password}
                                onChange={handleUser}
                            />
                        </div>
                    )}

                    {session && (
                        !editPassword ? (
                            <button
                                type="button"
                                onClick={() => setEditPassword(true)}
                            >
                                Cambiar password
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditPassword(false)
                                    setUser(prev => ({ ...prev, password: "" }))
                                }}
                            >
                                No cambiar password
                            </button>
                        )
                    )}

                    <div>
                        <button type="submit">Enviar</button>
                        <button onClick={handleBack}>Volver</button>
                    </div>
                </form>
            </>
        </>
    )
}

export default UserForm