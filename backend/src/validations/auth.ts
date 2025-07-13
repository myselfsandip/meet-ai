import z from "zod"

export const signUpSchema = z.object({
    name: z.string().max(100).trim(),
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(8, { message: "Password must be minimum 8 characters" }).trim()
});


export const signInSchema = z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().trim()
});