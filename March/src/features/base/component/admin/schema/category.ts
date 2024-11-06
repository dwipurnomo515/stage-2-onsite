import { z } from "zod";



export const CategorySchema = z.object({
    name: z.string().min(1, "Required / min 1 character")
});

export type CategoryInput = z.infer<typeof CategorySchema>;