"use client"
import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { handlePost } from "./handleSubmit"
import { useRouter } from "next/navigation"

const postFormPage = () => {

    const { data: session } = useSession()
    const [post, setPost] = useState<{ title: string, content: string }>({ title: "", content: "" })
    const [error, setError] = useState<string[]>([])
    const router = useRouter()

    const handleSetPost = (e: any) => {
        const { name, value } = e.target
        setPost(prev => (
            {
                ...prev,
                [name]: value
            }
        ))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setError([])

            if (session) {
                const res = await handlePost(post)

                if (res?.errors) {
                    console.log("errors de validacion", res.errors)
                    setError(Object.values(res.errors).flat())
                    return
                }
                router.push('/home')
            }

            return null
        } catch (error: any) {
            setError([error.message])
        }


    }

    const handleBack = () => router.push('/home')

    useEffect(() => {
        if (!session) router.push('/login')
    }, [session])

    return (
        <div>
            <div>
                <h2>Crea un post!</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    Titulo:
                    <input type="text" name="title" id="title" onChange={handleSetPost} />
                    <span>{post.title.length}/50</span>
                </div>
                <div>
                    Contenido:
                    <textarea name="content" id="content" onChange={handleSetPost}></textarea>
                    <span>{post.content.length}/100</span>
                </div>
                <div>
                    <button type="submit">Enviar</button>
                    <button onClick={handleBack}>Volver</button>
                </div>

                {error && <>
                    {error.map((e, i) => (
                        <ul style={{ color: 'red' }}>
                            <li key={i}>{e}</li>
                        </ul>
                    ))}
                </>}
            </form>
        </div>
    )
}

export default postFormPage