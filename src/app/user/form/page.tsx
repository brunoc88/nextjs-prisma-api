"use client"

import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { handlePost, handlePut } from "./handleSubmit"
import { useRouter } from "next/navigation"
import { signIn, signOut } from "next-auth/react"
import { email, object } from "zod"

const UserForm = () => {
    const { data: session } = useSession()
    const [user, setUser] = useState<{ email: string, password: string }>({ email: "", password: "" })
    const [error, setError] = useState<string[]>([])
    const [editPassword, setEditPassword] = useState<boolean>(true)
    const router = useRouter()

    useEffect(() => {
        if (!session?.user?.email) return

        setUser({
            email: session.user.email,
            password:""
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
                signIn('credentials',{
                    email:user.email,
                    password:user.password,
                    callbackUrl:'/home'
                })
                
            } else {
                let res;
                if(!user.password || user.password.length === 0) res = await handlePut({email:user.email})
                res = await handlePut(user)
                console.log('error front', res)
                if (res?.errors) {
                    setError(Object.values(res.errors).flat())
                    return
                }
                await signIn("credentials", { redirect: false })
            }
        } catch (err: any) {
            setError([err.message]) // errores del servidor
        }
    }


    const handleLogout = async () => {
        await signOut({ redirect: false })
        router.push("/login")

    }
    return (
        <>
            {session && <button onClick={(e) => {
                e.preventDefault()
                handleLogout()
            }}>LogOut</button>}
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

                    {!session || editPassword &&
                        <>
                            password:
                            <input
                                type="password"
                                name="password"
                                id="password"
                                onChange={handleUser}
                            />
                        </>}

                    {(session && editPassword) &&<>
                        <button onClick={(e) => {
                            e.preventDefault()
                            setEditPassword(prev => prev ? false : true)
                        }}>Editar Password</button>
                    </>}

                    <div>
                        <button type="submit">Enviar</button>
                    </div>
                </form>
            </>
        </>
    )
}

export default UserForm