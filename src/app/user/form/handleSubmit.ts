import { UserSchema, UserInputs, EditUserSchema } from "@/lib/schemas/user.schema"

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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  const body = await res.json()

  if (!res.ok) {
    // ACÁ se lanza el error
    throw new Error(body.error || 'Error desconocido')
  }

  return { ok: true }

  // no usamos catch porque el unico que puede es axios
}

const handlePut = async (data: { email?: string, password?: string }) => {
  const parsed = EditUserSchema.safeParse(data)

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors
    }
  }

  const res = await fetch('/api/user', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  const body = await res.json()

  if (!res.ok) {
    throw new Error(body.error || 'Error al actualizar')
  }

  return { ok: true }
}


export {
    handlePost,
    handlePut
}
