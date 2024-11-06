import prisma from "../prisma/client";


class CartService {

    async createOrUpdateCart(userId: number, productId: number, quantity: number) {
        let cart = await prisma.cart.findUnique({
            where: {
                userId
            },
            include: {
                items: true
            }

        });
        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId
                },
                include: {
                    items: true
                }
            });
        }


        const existingItem = await prisma.cartItem.findFirst({
            where: {
                productId,
                cartId: cart.id,
            },
        });


        if (existingItem) {
            return await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + quantity
                },
            });


        }

        const cartItem = await prisma.cartItem.create({
            data: {
                productId,
                cartId: cart.id,
                quantity,
            },
        });

        return cartItem
    }

    async getCartItems(userId: number) {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    },
                },
            },
        });

        if (!cart) {
            throw new Error("Cart not found")
        }

        return cart.items;
    }

    async remove(cartItemId: number) {
        return await prisma.cartItem.delete({
            where: {
                id: cartItemId
            }
        });

    }
    async updateCartItemQuantitiy(cartItemId: number, quantity: number) {
        return await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity }
        })
    }

}


export default new CartService();