import { Product } from "@prisma/client";
import { createProductDto, editProductDto } from "../dto/product";
import prisma from "../prisma/client";



class ProductService {
    async findAll() {
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
        return product;
    }



    async findByUserId(userId: number) {
        const product = await prisma.product.findMany({
            where: {
                userId
            }
        });

        if (!product) {
            throw new Error("product not found")
        }

        return product;
    }

    async findById(id: number) {
        const product = await prisma.product.findUnique({
            where: {
                id
            },
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
            throw new Error("product not found")
        }
    }

    async create(data: createProductDto, userId: number, categoryId: number): Promise<Product> {
        const product = await prisma.product.create({
            data: {
                productName: data.productName,
                productDesc: data.productDesc,
                price: +data.price,
                qty: +data.qty,
                photo: data.photo,
                userId,
                categoryId
            }
        });

        return product;
    }

    async edit(data: editProductDto, userId: number) {

        const existing = await prisma.product.findUnique({
            where: {
                id: data.id
            }
        })

        if (!existing || existing.userId !== userId) {
            throw new Error("Product not found or unauthorized");

        }


        const product = await prisma.product.update({
            where: {
                id: data.id,
            },
            data: {
                productName: data.productName,
                productDesc: data.productDesc,
                price: +data.price,
                qty: +data.qty,
                photo: data.photo,
            }
        });

        return product;
    }

    async delete(id: number) {
        const product = await prisma.product.delete({
            where: {
                id
            }
        });

        if (!product) {
            throw new Error("product not found");
        }
        return product;
    }


}

export default new ProductService;