"use client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const MyProfilePage = () => {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [posts, setPost] = useState<
        { id: number, title: string; content: string; userId: number }[]
    >([])

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    useEffect(() => {
        if (status !== "authenticated") return

        const loadPosts = async () => {
            const res = await fetch("/api/posts/me")
            const data = await res.json()
            setPost(data.blogs)
        }

        loadPosts()
    }, [status])

    const handleDelete = async (id: number) => {
        const ok = confirm("¿Desea eliminar este post?")
        if (!ok) return

        const res = await fetch(`/api/posts/${id}`, {
            method: "DELETE",
        })

        if (!res.ok) {
            const body = await res.json()
            console.log('error', body.error)
            alert("Error al eliminar el post")
            return
        }

        // actualizar estado sin volver a fetchear
        setPost(prev => prev.filter(post => post.id !== id))
    }


    if (status === "loading") {
        return <p>Cargando...</p>
    }

    return (
        <div>
            <div>{session?.user?.email}</div>

            <div>
                <button onClick={() => router.push('/post')}>Crear post</button>
                {posts.length > 0 ? (
                    posts.map((item, id) => (
                        <ul key={id}>
                            <li>{item.title}</li>
                            <li>{item.content}</li>
                            <button onClick={() => handleDelete(item.id)}>Eliminar</button>
                        </ul>
                    ))
                ) : (
                    <div>
                        <p>No tienes posts!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyProfilePage
