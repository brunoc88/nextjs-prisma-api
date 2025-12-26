import { UserSchema, UserInputs } from "@/lib/schemas/user.schema"

const handlePost = async (data: UserInputs) => {
    const parsed = UserSchema.safeParse(data)

    if (!parsed.success) {
        
        return {
            ok: false,
            errors: parsed.error.flatten().fieldErrors
            
        }
    }

    const res = await fetch('/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    return {
        ok: res.ok
    }
}

export default handlePost
