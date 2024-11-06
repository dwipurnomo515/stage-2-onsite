// src/controllers/paymentController.ts
import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

export class PaymentController {
    static async handlePaymentNotification(req: Request, res: Response) {
        try {
            const paymentStatus = req.body; // Data notifikasi dari Midtrans
            const { order_id, transaction_status, fraud_status } = paymentStatus;

            // Panggil PaymentService untuk memproses pembayaran
            const result = await PaymentService.processPaymentNotification(order_id, transaction_status, fraud_status);

            // Mengirimkan response sukses
            res.status(200).json({ message: "Payment processed successfully", order: result });
        } catch (error: any) {
            console.error("Error processing payment notification:", error);
            res.status(500).json({ message: "Error processing payment", error: error.message });
        }
    }
}
