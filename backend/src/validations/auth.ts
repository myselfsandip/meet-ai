import z from "zod"

export const signUpSchema = z.object({
    name: z.string().max(100),
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be minimum 8 characters" })
});


export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string()
});