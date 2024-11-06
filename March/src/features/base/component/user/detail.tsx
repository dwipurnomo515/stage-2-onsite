import { Button, Container, Grid2, List, ListItem, Typography } from "@mui/material";
import { Navbar } from "../navbar/navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiV1 } from "../../../../libs/api";

interface Product {
    productName: string;
    productDesc: string;
    price: number;
    qty: number;
    photo: string;
}


export function DetailProduct() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiV1.get(`/product/get/${id}`);
                console.log("ini detail", res.data);
                setProduct(res.data)

            } catch (error) {
                console.error("Error fetching data", error);

            }
        }
        fetchData();
    }, [id]);
    if (!product) return <Typography>Loading...</Typography>;


    return (
        <>
            <Navbar role="admin" />

            <Container sx={{ paddingTop: "100px", }}>
                <Grid2 container spacing={4}>
                    <Grid2 size={{ xs: 12, md: 5 }}>
                        <img
                            src={product.photo}
                            alt="Black mouse"
                            style={{ width: "100%", height: "auto" }}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 7 }}>
                        <Typography variant="h4" sx={{ color: "#ff4c4c" }}>
                            {product.productName}
                        </Typography>

                        <Typography variant="body1" sx={{ color: "white" }}>
                        </Typography>

                        Stock: {product.qty}

                        <Typography sx={{ color: "white", marginBottom: "10px" }}>
                            {product.productDesc}
                        </Typography>

                        <Typography variant="h5" sx={{ color: "#ff4c4c", fontWeight: "bold", textAlign: "right", marginBottom: "10px" }}>

                            Rp.{product.price}
                        </Typography>

                        <Button
                            variant="contained"
                            sx={{ backgroundColor: "#ff4c4c", width: "100%", padding: "10px", fontWeight: "bold" }}

                        >
                            Buy
                        </Button>

                    </Grid2>

                </Grid2>




            </Container>

        </>
    )


}