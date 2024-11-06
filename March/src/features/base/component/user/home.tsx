import { Box, Button, Card, CardContent, CardMedia, Container, Grid2, Typography } from "@mui/material";
import { Navbar } from "../navbar/navbar";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiV1 } from "../../../../libs/api";
import { showToast } from "../../../../utils/toast";

interface product {
    id: number;
    productName: string;
    productDesc: string;
    price: number;
    qty: number;
    photo: string;
}

export function HomePage() {
    const defaultImageUrl = "https://via.placeholder.com/200?text=No+Image";
    const [products, setProducts] = useState<product[]>([]);
    const role = "member";

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await apiV1.get('/product/getAll');
                console.log(res.data);
                setProducts(res.data);
            } catch (error) {
                console.error("error fetching product", error);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = async (productId: number) => {
        try {
            const res = await apiV1.post(`/cart/add/${productId}`, { quantity: 1 })
            console.log("hasil add", res.data);
            showToast.success("added success")
            navigate('/cart')

        } catch (error) {
            console.error("Failed to add to cart:", error);
            showToast.error("Error adding product to cart. Please try again.");
        }
    };

    return (
        <>
            <Navbar role={role} />
            <Container sx={{ paddingTop: "100px" }}>
                <Box sx={{ color: "#ff4c4c", fontSize: "22px", fontWeight: "Bold", marginBottom: "20px", paddingLeft: "55px" }}>
                    Product
                </Box>

                <Grid2 container spacing={1} paddingLeft={"55px"}>
                    {products.map(product => (
                        <Grid2 key={product.id} sx={{ display: "flex", flexDirection: "row" }}>
                            <Card sx={{ backgroundColor: "#2c2c2c", border: "none", mr: "2px", width: "300px", height: "100%" }}>
                                <CardMedia
                                    component={"img"}
                                    alt={product.productName}
                                    height={"200"}
                                    image={product.photo ? product.photo : defaultImageUrl}
                                    sx={{ width: "100%", objectFit: "cover" }}
                                />
                                <CardContent>
                                    <Typography variant="h5" sx={{ color: "#ff4c4c", fontSize: "14px", fontWeight: "bold" }}>
                                        {product.productName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                                        Rp.{product.price} <br />
                                        Stock: {product.qty}
                                    </Typography>
                                    <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                                        <Button
                                            onClick={() => handleAddToCart(product.id)}
                                            variant="contained"
                                            sx={{ backgroundColor: "#ff4c4c", color: "#fff" }}>
                                            Add to Cart
                                        </Button>
                                        <Link to={`/detail/${product.id}`} style={{ textDecoration: 'none' }}>
                                            <Button variant="outlined" sx={{ color: "#ff4c4c", borderColor: "#ff4c4c" }}>
                                                View Details
                                            </Button>
                                        </Link>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>
            </Container>
        </>
    );
}
