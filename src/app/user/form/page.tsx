"use client"

import { useSession } from "next-auth/react"
import React, { useState } from "react"
import handlePost from "./handleSubmit"
import { useRouter } from "next/navigation"

const UserForm = () => {
    const { data: session } = useSession()
    const [user, setUser] = useState<{ email: string, password: string }>({ email: "", password: "" })
    const [error, setError] = useState<string[]>([])
    const router = useRouter()

    const handleUser = (e: any) => {
        const { name, value } = e.target
        setUser(prev => (
            { ...prev, [name]: value }
        ))
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError([])

        const result = await handlePost(user)

        if (!result.ok) {
            setError(Object.values(result.errors ?? {}).flat())
            return
        }

        router.push('/home')
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
                        />
                    </div>
                    <div>
                        password:
                        <input
                            type="password"
                            name="password"
                            id="password"
                            onChange={handleUser}
                        />
                    </div>
                    <div>
                        <button type="submit">Enviar</button>
                    </div>
                </form>
            </>
        </>
    )
}

export default UserForm