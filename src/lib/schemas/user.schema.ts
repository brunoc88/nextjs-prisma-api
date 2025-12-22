import { z } from "zod"

export const UserSchema = z.object({
  email: z
    .string()
    .nonempty("Debe ingresar un email")
    .email("Email inválido")
    .transform((val) => val.trim().toLowerCase()),

  password: z
    .string()
    .nonempty("Debe ingresar una contraseña")
    .min(6, "Mínimo 6 caracteres")
    .transform((val) => val.trim()),
})

export const EditUserSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .optional()
    .transform((val) => val ? val.trim().toLowerCase() : val), //<-- val? "porque al ser optional transform se ejecuta igual"

  password: z
    .string()
    .min(6, "Mínimo 6 caracteres")
    .optional()
    .transform((val) => val ? val.trim() : val),
})

export type UserInputs = z.infer<typeof UserSchema>


