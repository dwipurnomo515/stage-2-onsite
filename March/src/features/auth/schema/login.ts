import { z } from "zod";



export const loginSchema = z.object({
    email: z.string().email("Email is required!"),
    password: z.string().min(4, "Password  must be 4 character")
});


export type LoginFormInput = z.infer<typeof loginSchema>;