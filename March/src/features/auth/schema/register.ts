import { TypeOf, z } from "zod";


export const registerSchema = z.object({
    name: z.string().min(4, "Name is required!"),
    email: z.string().email("Must email!"),
    password: z.string().min(4, "Password must be 4 character"),
});

export type RegisterFormInput = z.infer<typeof registerSchema>;