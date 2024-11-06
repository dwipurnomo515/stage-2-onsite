import { Request, Response } from "express";
import prisma from "../prisma/client";
import productService from "../services/product.service";
import categoryService from "../services/category.service";



class CategoryController {
    async findAll(req: Request, res: Response) {
        try {
            const category = await prisma.category.findMany({
                select: {
                    id: true,
                    name: true
                }
            });
            res.json(category);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message })
        }
    }

    async byId(req: Request, res: Response) {
        try {
            const id = +req.params.id
            const category = await prisma.category.findUnique({
                where: {
                    id
                }
            })
            res.json(category)
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message })

        }
    }

    async findByUserId(req: Request, res: Response) {
        try {
            const userId = +(req as any).user.id
            const category = await prisma.category.findMany({
                where: {
                    userId
                },
                select: {
                    id: true,
                    name: true
                }
            });

            if (!category || category.length === 0) {
                res.status(404).json({ message: "category not found" });
                return;
            }

            res.json(category);

        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message })
        }
    }

    async create(req: Request, res: Response) {
        try {
            const userId = +(req as any).user.id
            const body = req.body

            const result = await categoryService.create(body, userId);
            res.json(result)
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message })
        }
    }

    async edit(req: Request, res: Response) {
        try {
            const userId = +(req as any).user.id
            const body = req.body
            const id = +req.params.id

            const result = await categoryService.edit({ ...body, id }, userId)
            res.json(result)
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message })
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = req.params.id
            await categoryService.delete(+id)
            res.json({ Message: "category deleted" })
        } catch (error) {
            const err = error as Error;
            res.status(500).json({
                message: err.message
            });
        }
    }
}

export default new CategoryController;