import prisma from "../prisma/client";

export class PaymentService {
    static async processPaymentNotification(orderId: string, transactionStatus: string, fraudStatus: string) {
        try {
            // Cek apakah pembayaran berhasil dan diterima
            if (transactionStatus === 'capture' && fraudStatus === 'accept') {
                // Pembayaran berhasil
                // Update status order menjadi PAID
                const order = await prisma.order.update({
                    where: { id: parseInt(orderId) },
                    data: { status: 'PAID' },
                });

                // Proses pengurangan stok untuk setiap item dalam order
                const orderItems = await prisma.orderItem.findMany({
                    where: { orderId: parseInt(orderId) },
                });

                // Update stok untuk setiap item di order
                for (const item of orderItems) {
                    await prisma.product.update({
                        where: { id: item.productId },
                        data: {
                            qty: {
                                decrement: item.quantity,
                            },
                        },
                    });
                }

                return order; // Mengembalikan order yang sudah terupdate
            } else {
                throw new Error('Payment is not successful');
            }
        } catch (error) {
            console.error("Error in processing payment notification:", error);
            throw new Error("Payment processing failed");
        }
    }
}
