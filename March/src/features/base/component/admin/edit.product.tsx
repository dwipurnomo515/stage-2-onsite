import { Box, Button, Container, Input, TextareaAutosize, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Navbar } from "../navbar/navbar";
import { useNavigate, useParams } from "react-router-dom";
import { apiV1 } from "../../../../libs/api";

interface ProductInputs {
    id: number;
    productName: string;
    productDesc: string;
    price: number;
    qty: number;
}

export function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleSubmit, register, setValue } = useForm<ProductInputs>({
        defaultValues: {
            productName: '',
            productDesc: '',
            price: 0,
            qty: 0,
        }
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiV1.get(`/product/get/${id}`);
                const product = res.data;

                setValue("productName", product.productName);
                setValue("productDesc", product.productDesc);
                setValue("price", product.price);
                setValue("qty", product.qty);

                setSelectedImage(product.photo);
            } catch (error) {
                console.error("Error fetching", error);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, setValue]);

    const onSubmit = async (data: ProductInputs) => {
        try {
            const formData = new FormData();
            formData.append("productName", data.productName);
            formData.append("productDesc", data.productDesc);
            formData.append("price", data.price.toString());
            formData.append("qty", data.qty.toString());
            if (imageFile) {
                formData.append("photo", imageFile);
            }

            await apiV1.put(`/product/edit/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate('/product')
            console.log("Product updated successfully");
        } catch (error) {
            console.error("Error updating product", error);
        }
    };

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImageFile(file);
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    return (
        <>
            <Navbar role="admin" />
            <Container sx={{ paddingTop: "100px", color: "white" }}>
                <Typography variant="h4" color="white">
                    Edit Product
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box display="flex" alignItems="center">
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                backgroundColor: "#ff4b4b",
                                "&:hover": { backgroundColor: "#ff1a1a" },
                                color: "white",
                                marginTop: "40px",
                                textTransform: "none",
                            }}
                        >
                            Upload Image
                            <Input
                                sx={{ display: "none" }}
                                type="file"
                                hidden
                                onChange={handleImage}
                            />
                        </Button>
                        {selectedImage && (
                            <Box sx={{ marginLeft: "16px", marginTop: "40px" }}>
                                <img
                                    src={selectedImage}
                                    alt="Selected"
                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                />
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ marginBottom: "16px", marginTop: "20px", color: "white" }}>
                        <TextField
                            fullWidth
                            sx={{
                                backgroundColor: "#424242",
                                "& .MuiInputBase-root": {
                                    backgroundColor: "#424242",
                                    border: "1px solid #b0bec5",
                                    padding: "4px",
                                },
                                "& .MuiInputBase-input": { color: "white", padding: "6px" },
                            }}
                            placeholder="Product Name"
                            variant="outlined"
                            {...register("productName")}
                        />
                    </Box>

                    <Box sx={{ marginBottom: "16px", marginTop: "20px", color: "white" }}>
                        <TextareaAutosize
                            {...register("productDesc")}
                            minRows={3}
                            style={{
                                color: "white",
                                border: "1px solid #b0bec5",
                                backgroundColor: "#424242",
                                width: "100%",
                                padding: "8px",
                            }}
                            placeholder="Description"
                        />
                    </Box>

                    <Box sx={{ marginBottom: "16px", marginTop: "20px", color: "white" }}>
                        <TextField
                            fullWidth
                            placeholder="Price"
                            sx={{
                                backgroundColor: "#424242",
                                "& .MuiInputBase-root": {
                                    backgroundColor: "#424242",
                                    border: "1px solid #b0bec5",
                                    padding: "4px",
                                },
                                "& .MuiInputBase-input": { color: "white", padding: "6px" },
                            }}
                            variant="outlined"
                            {...register("price")}
                        />
                    </Box>

                    <Box sx={{ marginBottom: "16px", marginTop: "20px", color: "white" }}>
                        <TextField
                            fullWidth
                            sx={{
                                backgroundColor: "#424242",
                                "& .MuiInputBase-root": {
                                    backgroundColor: "#424242",
                                    border: "1px solid #b0bec5",
                                    padding: "4px",
                                },
                                "& .MuiInputBase-input": { color: "white", padding: "6px" },
                            }}
                            placeholder="Stock"
                            variant="outlined"
                            {...register("qty")}
                        />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            width: "100%",
                            backgroundColor: "#59be5e",
                            marginTop: "30px",
                        }}
                    >
                        Save
                    </Button>
                </form>
            </Container>
        </>
    );
}
