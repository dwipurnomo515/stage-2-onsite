import { PrismaClient } from '@prisma/client';
import midtrans from '../libs/midtrans';

const prisma = new PrismaClient();

export class CheckoutService {
    static async createOrder(userId: number, items: any[], name: string, address: string, paymentMethod: string) {
        const prisma = new PrismaClient();  // Pastikan Anda menginisialisasi PrismaClient

        try {
            // 1. Membuat order baru
            const order = await prisma.order.create({
                data: {
                    user: { connect: { id: userId } },
                    totalAmount: items.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0),
                    status: 'PENDING',
                    orderItems: {
                        create: items.map((item: any) => ({
                            product: { connect: { id: item.product.id } },
                            quantity: item.quantity,
                            totalPrice: item.product.price * item.quantity,
                        })),
                    },
                },
            });

            // 2. Update quantity produk yang dibeli
            for (let item of items) {
                const product = await prisma.product.update({
                    where: { id: item.product.id },
                    data: {
                        qty: {
                            decrement: item.quantity,  // Mengurangi kuantitas produk
                        },
                    },
                });
            }

            // 3. Siapkan data transaksi untuk Midtrans
            const transactionDetails = {
                order_id: `ORDER-${order.id}`,  // Gunakan order.id atau ID unik lainnya
                gross_amount: order.totalAmount, // Total amount untuk transaksi
            };

            const itemsData = items.map((item: any) => ({
                id: item.product.id.toString(),
                price: item.product.price,
                quantity: item.quantity,
                name: item.product.productName,
            }));

            const customerDetails = {
                first_name: name,
                email: "customer@example.com",
                billing_address: {
                    first_name: name,
                    address: address,
                },
            };

            const paymentData = {
                transaction_details: transactionDetails,
                item_details: itemsData,
                customer_details: customerDetails,
                enabled_payments: [paymentMethod],
                bank_transfer: paymentMethod === 'bank_transfer' ? { bank: 'bca' } : undefined,
                finish_redirect_url: "http://localhost:5173/",
                callback_url: "http://localhost:5173/payment/callback",
            };

            // 4. Menggunakan Snap untuk membuat transaksi
            const midtransResponse = await midtrans.createTransaction(paymentData);
            console.log("midtransResponse", midtransResponse); // Log respons dari Midtrans untuk memeriksa redirect_url

            // 5. Simpan paymentUrl ke dalam order
            const updatedOrder = await prisma.order.update({
                where: { id: order.id },
                data: { paymentUrl: midtransResponse.redirect_url },
            });

            // 6. Hapus cart items (pastikan Anda memiliki tabel cart)
            await prisma.cartItem.deleteMany({
                where: {
                    cart: {
                        userId: userId
                    }
                },
            });

            // 7. Kembalikan URL untuk pembayaran
            return midtransResponse.redirect_url;

        } catch (error) {
            console.error("Error during checkout:", error);
            throw new Error("Error processing the order");
        }
    }
}

