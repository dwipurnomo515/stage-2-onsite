import { Request, Response } from "express";
import uploader from "../libs/cloudinary";
import productService from "../services/product.service";
import prisma from "../prisma/client";


class ProductController {

    async findAll(req: Request, res: Response) {
        try {
            const product = await prisma.product.findMany({
                select: {
                    id: true,
                    productName: true,
                    productDesc: true,
                    price: true,
                    qty: true,
                    photo: true,

                }
            });
            res.json(product)

        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : "Server error" });

        }
    }

    async findByUserId(req: Request, res: Response): Promise<void> {
        try {
            const userId = +(req as any).user.id

            const product = await prisma.product.findMany({
                where: { userId },
                select: {
                    id: true,
                    productName: true,
                    productDesc: true,
                    price: true,
                    qty: true,
                    photo: true,
                }
            });

            if (!product || product.length === 0) {
                res.status(404).json({ message: "Product not found" });
                return;
            }

            res.json(product);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : "Server error" });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);

            const product = await prisma.product.findUnique({
                where: { id },
                select: {
                    id: true,
                    productName: true,
                    productDesc: true,
                    price: true,
                    qty: true,
                    photo: true,
                }
            });

            if (!product) {
                res.status(404).json({ message: "Product not found" });
                return;
            }

            res.json(product);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : "Server error" });
        }
    }
    async create(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const categoryId = Number(req.params.id);
            const body = req.body;

            console.log(req.body);
            console.log(req.file);

            if (!categoryId || isNaN(categoryId)) {
                res.status(400).json({ message: "Invalid category ID" });
                return;
            }

            body.price = parseInt(body.price, 10);
            body.qty = parseInt(body.qty, 10);

            if (req.file) {
                const photoUrl = await uploader(req.file as Express.Multer.File);
                console.log("Photo URL:", photoUrl);

                body.photo = photoUrl.url;
            } else {
                body.photo = "https://via.placeholder.com/200?text=No+Image";
                console.log("Using default photo URL:", body.photo);

            }

            await productService.create(body, userId, categoryId);
            res.json({ message: "Create success" });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    }


    async edit(req: Request, res: Response) {
        try {
            const user = (req as any).user.id
            const body = req.body
            const id = +req.params.id
            if (req.file) {
                const photoUrl = await uploader(req.file as Express.Multer.File)
                body.photo = photoUrl.url
            }
            await productService.edit({ ...body, id }, user)
            res.json({ message: "edit Success" })

        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message })

        }
    }
    async delete(req: Request, res: Response) {
        try {
            const id = +req.params.id;
            await productService.delete(id);
            res.json({ message: "delete success" })

        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message })
        }
    }
}

export default new ProductController;