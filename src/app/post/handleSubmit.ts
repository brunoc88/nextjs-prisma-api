import { postSchema } from "@/lib/schemas/post.schema"

const handlePost = async (data: { title: string, content: string }) => {
    const parsed = postSchema.safeParse(data)
    if (!parsed.success) {
        return {
            ok: false,
            errors: parsed.error.flatten().fieldErrors
        }
    }

    const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    const body = await res.json()

    if (!res.ok) {
        // ACÁ se lanza el error
        throw new Error(body.error || 'Error desconocido')
    }

    return {ok:true, msj:'POST CREADO!'}
}

export {
    handlePost
}