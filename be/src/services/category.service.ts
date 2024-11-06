import { createCategoryDto, editCategoryDto } from "../dto/category";
import prisma from "../prisma/client";


class CategoryService {

    async create(data: createCategoryDto, userId: number) {
        const category = await prisma.category.create({
            data: {
                name: data.name,
                userId
            }
        });
        return category;

    }

    async edit(data: editCategoryDto, userId: number) {
        const existing = await prisma.category.findUnique({
            where: {
                id: data.id
            }
        })

        if (!existing || existing.userId !== userId) {
            throw new Error("not found")
        }

        const category = await prisma.category.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name
            }
        });
        return category;
    }

    async delete(id: number) {
        const category = await prisma.category.delete({
            where: {
                id
            }
        });

        if (!category) {
            throw new Error("category not found")
        }

        return category;
    }

}

export default new CategoryService;