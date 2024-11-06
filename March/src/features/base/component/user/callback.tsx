import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom"; // Untuk mengambil parameter URL

export function PaymentCallback() {
    const navigate = useNavigate();
    const location = useLocation(); // Untuk mengambil query parameter dari URL
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        // Ambil parameter status dan order_id dari URL
        const params = new URLSearchParams(location.search);
        const status = params.get("status");
        const order_id = params.get("order_id");

        if (status && order_id) {
            setPaymentStatus(status);
            setOrderId(order_id);

            // Jika status pembayaran gagal, set error message
            if (status === "FAILED") {
                setErrorMessage("Payment failed. Please try again.");
            } else if (status === "PAID") {
                setErrorMessage(null); // Reset error message jika pembayaran berhasil
            }
        } else {
            // Jika parameter tidak ditemukan, tampilkan error
            setErrorMessage("Invalid callback response.");
        }
    }, [location.search]); // Menggunakan `location.search` agar react router menangani perubahan URL

    const handleRedirectToHome = () => {
        navigate("/"); // Arahkan kembali ke halaman utama setelah beberapa detik
    };

    return (
        <Container sx={{ color: "white", paddingTop: "100px", textAlign: "center" }}>
            <Typography variant="h4" sx={{ marginBottom: "20px" }}>
                Payment Status
            </Typography>
            {paymentStatus ? (
                <>
                    <Typography variant="h5" sx={{ color: paymentStatus === "PAID" ? "green" : "red", marginBottom: "20px" }}>
                        {paymentStatus === "PAID" ? "Payment Successful" : "Payment Failed"}
                    </Typography>
                    {paymentStatus === "FAILED" && errorMessage && (
                        <Typography variant="body1" sx={{ color: "red", marginBottom: "20px" }}>
                            {errorMessage}
                        </Typography>
                    )}
                    <Box sx={{ marginTop: "20px" }}>
                        <Typography variant="body1">
                            Order ID: <strong>{orderId}</strong>
                        </Typography>
                    </Box>
                    <Button variant="contained" color="primary" onClick={handleRedirectToHome} sx={{ marginTop: "20px" }}>
                        Go to Homepage
                    </Button>
                </>
            ) : (
                <Typography variant="h6" sx={{ color: "red" }}>
                    No valid status received. Please check your payment status.
                </Typography>
            )}
        </Container>
    );
}
