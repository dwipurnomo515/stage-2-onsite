import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { Navbar } from "../navbar/navbar";
import { useNavigate } from "react-router-dom";
import { apiV1 } from "../../../../libs/api";

interface CartItem {
    id: number;
    product: product;
    quantity: number;
}

interface product {
    id: number;
    photo: string;
    productName: string;
    productDesc: string;
    price: number;
    qty: number;
}

export function Cart() {
    const [items, setItems] = useState<CartItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await apiV1.get('/cart/get');
                console.log("ini cart", res.data);
                setItems(res.data);
            } catch (error) {
                console.error("Error fetching cart", error);
            }
        };

        fetchCart();
    }, []);

    const handleUpdateQuantity = async (id: number, newQuantity: number) => {
        if (newQuantity <= 0) return;
        try {
            await apiV1.put(`/cart/update/${id}`, { quantity: newQuantity });
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            console.error("Error updating item quantity", error);
        }
    };

    const handleRemoveItem = async (id: number) => {
        try {
            await apiV1.delete(`/cart/delete/${id}`);
            setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Error removing item from cart", error);
        }
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <>
            <Navbar role="member" />

            <Container sx={{ color: "white", paddingTop: "100px" }}>
                <Typography variant="h4" sx={{ marginBottom: "20px" }}>
                    Shopping Cart
                </Typography>

                <TableContainer component={Paper} sx={{ color: "white", backgroundColor: "#303030" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: "#404040", color: "white" }}>Photo</TableCell>
                                <TableCell sx={{ backgroundColor: "#404040", color: "white" }}>Product Name</TableCell>
                                <TableCell sx={{ backgroundColor: "#404040", color: "white" }}>Price</TableCell>
                                <TableCell sx={{ backgroundColor: "#404040", color: "white", paddingLeft: "80px" }}>Qty</TableCell>
                                <TableCell sx={{ backgroundColor: "#404040", color: "white" }}>Subtotal</TableCell>
                                <TableCell sx={{ backgroundColor: "#404040", color: "white" }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={item.product.id} sx={{ color: "white", backgroundColor: index % 2 === 0 ? '#232323' : '#303030' }}>
                                    <TableCell sx={{ color: "white" }}>
                                        <img src={item.product.photo} alt={item.product.productName} style={{ width: "80px" }} />
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>{item.product.productName}</TableCell>
                                    <TableCell sx={{ color: "white" }}>Rp {item.product.price.toLocaleString()}</TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                        <Button
                                            variant="text"
                                            color="primary"
                                            sx={{ backgroundColor: 'transparent', color: 'white' }}
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                        >
                                            -
                                        </Button>
                                        <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                                        <Button
                                            variant="text"
                                            color="primary"
                                            sx={{ backgroundColor: 'transparent', color: 'white' }}
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </Button>
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>Rp {(item.product.price * item.quantity).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Divider sx={{ margin: "20px 0", backgroundColor: "white" }} />
                <Typography variant="h6" sx={{ textAlign: "right", marginBottom: "20px", color: "white" }}>
                    Total: Rp {calculateTotal().toLocaleString()}
                </Typography>
                <Button variant="contained" color="success" sx={{ float: "right" }} onClick={handleCheckout}>
                    Proceed to Checkout
                </Button>
            </Container>
        </>
    );
}
