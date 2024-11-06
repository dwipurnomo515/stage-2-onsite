import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { CheckoutService } from '../services/checkout.service';

export class CheckoutController {
    static async handleCheckout(req: Request, res: Response) {
        const userId = (req as any).user.id;
        const { name, address, paymentMethod } = req.body;

        try {
            const userCart = await prisma.cart.findUnique({
                where: { userId },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            if (!userCart || userCart.items.length === 0) {
                res.status(400).json({ message: 'Your cart is empty' });
                return;
            }

            const items = userCart.items.map(item => ({
                product: item.product,
                quantity: item.quantity,
            }));

            const paymentUrl = await CheckoutService.createOrder(userId, items, name, address, paymentMethod);

            res.json({ paymentUrl });
        } catch (error) {
            console.error('Error processing checkout:', error);
            res.status(500).json({ message: 'Error processing the order' });
        }
    }

    static async getOrder(req: Request, res: Response) {
        try {
            const transactions = await prisma.order.findMany({
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            res.status(200).json(transactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            res.status(500).json({ error: "Error fetching transactions" });
        }
    }


    static async getOrderById(req: Request, res: Response) {
        const id = +req.params.id;

        try {
            const transaction = await prisma.order.findUnique({
                where: { id },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            if (!transaction) {
                res.status(404).json({ error: 'Transaction not found' });
                return;
            }

            res.status(200).json(transaction);
        } catch (error) {
            console.error("Error fetching transaction details:", error);
            res.status(500).json({ error: "Error fetching transaction details" });
        }
    }
    static async getOrderByUserId(req: Request, res: Response) {
        const userId = +(req as any).user.id;

        try {
            const transaction = await prisma.order.findMany({
                where: { userId: userId },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            if (!transaction) {
                res.status(404).json({ error: 'Transaction not found' });
                return;
            }

            res.status(200).json(transaction);
        } catch (error) {
            console.error("Error fetching transaction details:", error);
            res.status(500).json({ error: "Error fetching transaction details" });
        }
    }

    static async handlePaymentCallback(req: Request, res: Response) {
        const { orderId, paymentStatus } = req.body; // Asumsikan ini dari gateway pembayaran

        try {
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: { orderItems: true },
            });

            if (!order) {
                res.status(404).json({ message: 'Order not found' });
                return;
            }

            if (order.status !== 'PENDING') {
                res.status(400).json({ message: 'Payment already processed' });
                return;
            }

            if (paymentStatus === 'SUCCESS') {
                // Update status pembayaran menjadi "PAID"
                await prisma.order.update({
                    where: { id: orderId },
                    data: {
                        status: 'PAID',
                    },
                });

                // Update stok produk dan hapus item keranjang
                const updateProductAndDeleteCartPromises = order.orderItems.map(item => {
                    return prisma.product.update({
                        where: { id: item.productId },
                        data: {
                            qty: {
                                decrement: item.quantity,  // Kurangi stok produk
                            },
                        }
                    }).then(() => {
                        return prisma.cartItem.deleteMany({
                            where: { productId: item.productId },  // Hapus item di cart
                        });
                    });
                });

                // Tunggu semua operasi selesai
                await Promise.all(updateProductAndDeleteCartPromises);


                res.json({ message: 'Order successfully processed and payment received' });
            } else {
                // Pembayaran gagal, bisa menangani logika di sini
                await prisma.order.update({
                    where: { id: orderId },
                    data: {
                        status: 'FAILED',
                    },
                });

                res.json({ message: 'Payment failed' });
            }
        } catch (error) {
            console.error('Error handling payment callback:', error);
            res.status(500).json({ message: 'Error processing payment callback' });
        }
    }



}
