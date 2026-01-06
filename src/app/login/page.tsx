"use client"

import { signIn } from "next-auth/react"
import React, { useState } from "react"
import { UserSchema } from "@/lib/schemas/user.schema"
import { useRouter } from "next/navigation"

const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string[]>([])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError([])

    const parsed = UserSchema.safeParse({ email, password })

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      setError([
        ...(errors.email ?? []),
        ...(errors.password ?? [])
      ])
      return
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/home"
    })

    if (res?.error) {
      setError(["Credenciales inválidas"])
      return
    }

    router.push(res?.url ?? "/home")
  }

  return (
    <>
      <h1>Login</h1>

      {/* GOOGLE LOGIN */}
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/home" })}
      >
        Continuar con Google
      </button>

      <hr />

      {/* CREDENTIALS LOGIN */}
      <form onSubmit={handleLogin}>
        {error.length > 0 && (
          <ul style={{ color: "red" }}>
            {error.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        )}

        <div>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div>
          Password:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </>
  )
}

export default LoginPage
