import { Box, Button, Container, FormControl, Input, InputLabel, MenuItem, Select, SelectChangeEvent, TextareaAutosize, TextField, Typography } from "@mui/material";
import { Navbar } from "../navbar/navbar";
import React, { useEffect, useState } from "react";
import { apiV1 } from "../../../../libs/api";
import { useForm } from "react-hook-form";
import { ProductInput, ProductSchema } from "./schema/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../../utils/toast";
import { any } from "zod";

interface categories {
    id: number,
    name: string
}



export function AddProduct() {

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductInput>({
        resolver: zodResolver(ProductSchema)
    });

    const navigate = useNavigate();
    const [category, setCategory] = useState<categories[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | string>("")
    const [photo, setPhoto] = useState<File | null>(null);

    const onSubmit = async (data: ProductInput) => {


        const formData = new FormData();

        formData.append("productName", data.productName);
        formData.append("productDesc", data.productDesc)
        formData.append("price", data.price.toString());
        formData.append("qty", data.qty.toString());
        formData.append("categoryId", selectedCategory.toString());

        if (photo) {
            formData.append("photo", photo);
        }
        try {
            const res = await apiV1.post(`/product/create/${selectedCategory}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });

            if (res.status === 201 || res.status === 200) {
                showToast.success("Product added success");
                reset();
                navigate('/product')
            }
        } catch (error: any) {
            console.error("Error adding", error);
            showToast.error(error.res.data.message || "Adding failed")
        }
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    }

    useEffect(() => {
        try {
            const fetchData = async () => {
                const res = await apiV1.get('/category/getAll');
                setCategory(res.data)
            }
            fetchData();
        } catch (error) {
            console.error("Fetching error", error)
        }
    }, []);

    const handleCategory = (event: SelectChangeEvent<string | number>) => {
        setSelectedCategory(event.target.value)
        console.log("event", event.target.value);

    }
    return (

        <>
            <Navbar role="admin" />
            <Container sx={{ color: "white", paddingTop: "120px" }}>
                <Typography variant="h4">
                    Add Product
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
                                marginTop: "10px",
                                textTransform: "none",
                            }}
                        >
                            Upload Image
                            <Input
                                sx={{ display: "none" }}
                                type="file"
                                hidden
                                onChange={handlePhotoChange}
                            />
                        </Button>

                    </Box>

                    <Box sx={{ marginBottom: "16px", marginTop: "20px", color: "white" }}>
                        <TextField
                            fullWidth
                            {...register("productName")}
                            error={!!errors.productName}
                            helperText={errors.productName?.message}
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
                            {...register("price")}
                            helperText={errors.price?.message}
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
                        />
                    </Box>

                    <Box sx={{ marginBottom: "16px", marginTop: "20px", color: "white" }}>
                        <TextField
                            {...register("qty")}
                            helperText={errors.qty?.message}
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
                        />
                    </Box>
                    <Box sx={{ marginBottom: "16px", marginTop: "20px", color: "white" }}>
                        <FormControl fullWidth variant="outlined" sx={{ backgroundColor: "#424242" }}>
                            <Select
                                value={selectedCategory}
                                onChange={handleCategory}
                                displayEmpty
                                sx={{
                                    backgroundColor: "#black",
                                    color: "white",
                                    ".MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#b0bec5"
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#59be5e"
                                    },
                                    "& .MuiSvgIcon-root": {
                                        color: "white"
                                    }
                                }}
                            >
                                <MenuItem value="">
                                    <em style={{ color: "gray" }}>Select Category</em>
                                </MenuItem>
                                {category.map((cate) => (
                                    <MenuItem key={cate.id} value={cate.id}
                                        sx={{
                                            backgroundColor: "#b0bec5",
                                            "&:hover": {
                                                backgroundColor: "#bdbdbd",
                                            },
                                        }}
                                    >
                                        {cate.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
    )
}