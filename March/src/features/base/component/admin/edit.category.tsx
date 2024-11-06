import { useForm } from "react-hook-form";
import { Navbar } from "../navbar/navbar";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiV1 } from "../../../../libs/api";



interface CategoryInputs {
    name: string;
}

export function EditCategory() {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { handleSubmit, register, setValue } = useForm<CategoryInputs>({
        defaultValues: {
            name: ""
        }
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiV1.get(`/category/get/${id}`);
                console.log("data edit", res.data);
                const categoryData = res.data;

                setValue("name", categoryData.name)


            } catch (error) {
                console.error("Error fetching category data:", error);

            }

        }
        if (id) {

            fetchData();
        }
    }, [id, setValue])
    const onSubmit = async (data: CategoryInputs) => {
        try {
            await apiV1.put(`/category/edit/${id}`, data);
            navigate('/category');
        } catch (error) {
            console.error("Error fetching category data:", error);
            setErrorMessage("Failed to load category data.");
        }
    };

    return (
        <>
            <Navbar role="admin" />
            <Container sx={{ color: 'white', paddingTop: '120px' }}>
                <Typography variant="h4" color="white">
                    Edit Category
                </Typography>
                {errorMessage && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Typography>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ marginBottom: "16px", marginTop: "20px", color: "white" }}>
                        <TextField
                            fullWidth
                            sx={{ backgroundColor: "#424242", '& .MuiInputBase-root': { backgroundColor: '#424242', border: '1px solid #b0bec5', padding: "4px" }, '& .MuiInputBase-input': { color: 'white', padding: "6px" } }}
                            placeholder="Category Name"
                            variant="outlined"
                            {...register("name")}
                        />
                    </Box>
                    <Button variant="contained" type="submit" sx={{ width: "100%", backgroundColor: "#59be5e", marginTop: "30px" }}>
                        Save
                    </Button>
                </form>

            </Container>

        </>
    );
}