import { Button, Container, TextField, Typography } from "@mui/material";
import { Navbar } from "../navbar/navbar";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apiV1 } from "../../../../libs/api";
import { showToast } from "../../../../utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryInput, CategorySchema } from "./schema/category";




export function AddCategory() {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CategoryInput>({
        resolver: zodResolver(CategorySchema)
    });

    const navigate = useNavigate();


    const onSubmit = async (data: CategoryInput) => {
        try {
            const res = await apiV1.post('/category/create', data);

            if (res.status === 201 || res.status === 200) {
                showToast.success("Category added success");
                reset();
                navigate('/category')
            }
        } catch (error: any) {
            console.error("Error adding", error);
            showToast.error(error.res?.data?.message || "Failed add");
        }
    }
    return (
        <>
            <Navbar role="admin" />
            <Container sx={{ color: "white", paddingTop: "120px" }}>
                <Typography variant="h4" mb={'20px'} >
                    Add Category
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        {...register("name")}
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name ? errors.name.message : ""}
                        sx={{
                            backgroundColor: "#424242",
                            "& .MuiInputBase-root": {
                                backgroundColor: "#424242",
                                border: "1px solid #b0bec5",
                                padding: "4px",
                            },
                            "& .MuiInputBase-input": { color: "white", padding: "6px" },
                        }}
                        placeholder="Category Name"
                        variant="outlined"
                    />

                    <Button type="submit" disabled={isSubmitting} variant="contained" sx={{ width: "100%", backgroundColor: "#59be5e", mt: "20px", padding: "10px" }}>
                        {isSubmitting ? "Adding ..." : "Add"}
                    </Button>


                </form>
            </Container>


        </>

    )

}