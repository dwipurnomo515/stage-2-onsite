import { z } from "zod";



export const ProductSchema = z.object({
    productName: z.string().min(1, "Min 1 character"),
    productDesc: z.string().min(1, "Min 1 character"),
    price: z.string().min(1, "Min 1 character"),
    qty: z.string(),
    photo: z.string().url().optional(),

});

export type ProductInput = z.infer<typeof ProductSchema>;