import {z} from "zod"

export const postSchema = z.object({
    title: z
    .string()
    .nonempty("Debe ingresar un titulo")
    .max(50, "Max 50 caracteres")
    .min(5, "Min 5 caracteres")
    .transform(val => val.trim().toLowerCase()),
    content: z
    .string()
    .nonempty("Debe ingresar el contenido")
    .max(100, "Max 100 caracteres")
    .min(5, "Min 5 caracteres")
    .transform(val => val.trim().toLowerCase())
})

export type PostInputs = z.infer<typeof postSchema>