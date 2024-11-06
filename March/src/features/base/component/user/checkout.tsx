import { Container, Typography, TextField, Button, Paper, Grid, IconButton, Divider, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import { Navbar } from "../navbar/navbar";
import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { apiV1 } from "../../../../libs/api"; // Import axios instance

interface CartItem {
    id: number;
    product: Product;
    quantity: number;
}

interface Product {
    id: number;
    photo: string;
    productName: string;
    productDesc: string;
    price: number;
    qty: number;
}

export function Checkout() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null); // To track payment status
    const [orderId, setOrderId] = useState<number | null>(null); // To track the current order ID

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await apiV1.get('/cart/get');
                console.log("Cart items:", res.data);
                setCartItems(res.data);
            } catch (error) {
                console.error("Error fetching cart", error);
            }
        };

        fetchCart();
    }, []);

    const handlePlaceOrder = async () => {
        try {
            setIsLoading(true); // Set loading state to true when starting the checkout process

            const response = await apiV1.post("/checkout/", {
                name,
                address,
                paymentMethod,
            });

            const { paymentUrl, orderId } = response.data;

            setOrderId(orderId); // Save orderId to use in polling
            setPaymentStatus(null); // Reset payment status before redirect

            // Redirect user to the payment page (external)
            window.location.href = paymentUrl;

            // Optionally, you can implement a polling mechanism here for the payment status

        } catch (error) {
            console.error("Error placing order:", error);
            setIsLoading(false); // Turn off loading in case of error
        }
    };

    const handleUpdateQuantity = async (id: number, newQuantity: number) => {
        if (newQuantity <= 0) return;
        try {
            await apiV1.put(`/cart/update/${id}`, { quantity: newQuantity });
            setCartItems((prevCartItems) =>
                prevCartItems.map((item) =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            console.error("Error updating item quantity", error);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    // Polling mechanism for checking payment status
    useEffect(() => {
        const pollPaymentStatus = async () => {
            if (!orderId) return; // Don't start polling until we have an orderId

            const interval = setInterval(async () => {
                try {
                    const response = await apiV1.post("/checkout/payment-status", { orderId });
                    const status = response.data.status;

                    if (status === "PAID" || status === "FAILED") {
                        setPaymentStatus(status);
                        clearInterval(interval); // Stop polling once we get a result
                    }
                } catch (error) {
                    console.error("Error checking payment status", error);
                }
            }, 5000); // Poll every 5 seconds

            return () => clearInterval(interval); // Cleanup on component unmount
        };

        if (orderId) {
            pollPaymentStatus(); // Start polling when orderId is available
        }
    }, [orderId]);

    return (
        <>
            <Navbar role="member" />
            <Container sx={{ color: "white", paddingTop: "100px" }}>
                <Typography variant="h4" sx={{ marginBottom: "20px" }}>
                    Checkout
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: "20px", backgroundColor: "#303030", color: "white" }}>
                            <Typography variant="h6" sx={{ marginBottom: "15px" }}>Billing Details</Typography>
                            <TextField
                                fullWidth
                                label="Full Name"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={{ marginBottom: "15px", backgroundColor: "white", borderRadius: "4px" }}
                            />
                            <TextField
                                fullWidth
                                label="Address"
                                variant="outlined"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                sx={{ marginBottom: "15px", backgroundColor: "white", borderRadius: "4px" }}
                            />

                            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
                                <FormLabel>Payment Method</FormLabel>
                                <RadioGroup
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <FormControlLabel
                                        value="credit_card"
                                        control={<Radio />}
                                        label="Credit Card"
                                    />
                                    <FormControlLabel
                                        value="bank_transfer"
                                        control={<Radio />}
                                        label="Bank Transfer"
                                    />
                                    <FormControlLabel
                                        value="gopay"
                                        control={<Radio />}
                                        label="GoPay"
                                    />
                                </RadioGroup>
                            </FormControl>

                            <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                onClick={handlePlaceOrder}
                                disabled={isLoading} // Disable the button while loading
                            >
                                {isLoading ? "Processing..." : "Place Order"}
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: "20px", backgroundColor: "#303030", color: "white" }}>
                            <Typography variant="h6" sx={{ marginBottom: "15px" }}>Order Summary</Typography>
                            {cartItems.map((item) => (
                                <div key={item.id} style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                                    <img src={item.product.photo} alt={item.product.productName} style={{ width: 50, height: 50, marginRight: "15px" }} />

                                    <div style={{ flexGrow: 1 }}>
                                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                            {item.product.productName}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#aaaaaa" }}>
                                            Price: Rp {item.product.price.toLocaleString()}
                                        </Typography>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} color="error" size="small">
                                                <RemoveIcon />
                                            </IconButton>
                                            <Typography variant="body1" sx={{ marginX: "10px" }}>{item.quantity}</Typography>
                                            <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} color="primary" size="small">
                                                <AddIcon />
                                            </IconButton>
                                        </div>
                                        <Typography variant="body2" sx={{ color: "white", marginTop: "5px" }}>
                                            Total: Rp {(item.product.price * item.quantity).toLocaleString()}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                            <Divider sx={{ backgroundColor: "white", marginY: "15px" }} />
                            <Typography variant="h6" sx={{ textAlign: "right" }}>
                                Grand Total: Rp {calculateTotal().toLocaleString()}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Payment Status (Will show after polling) */}
                {paymentStatus && (
                    <Typography variant="h5" sx={{ marginTop: "20px", textAlign: "center", color: paymentStatus === 'PAID' ? 'green' : 'red' }}>
                        {paymentStatus === "PAID" ? "Payment Successful" : "Payment Failed"}
                    </Typography>
                )}
            </Container>
        </>
    );
}
