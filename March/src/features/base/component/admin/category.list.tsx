import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Navbar } from '../navbar/navbar';
import { useEffect, useState } from 'react';
import { apiV1 } from '../../../../libs/api';
import { showToast } from '../../../../utils/toast';

interface Category {
    id: number;
    name: string;
}

export function CategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiV1.get('/category/get');
                console.log("ini data cate", res.data);
                setCategories(res.data);
            } catch (error) {
                console.error("error fetching", error);
            }
        };

        fetchData();
    }, []);

    const handleDeleteOpen = (id: number) => {
        setCategoryIdToDelete(id);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setCategoryIdToDelete(null);
    };

    const handleDelete = async () => {
        if (categoryIdToDelete) {
            try {
                await apiV1.delete(`/category/delete/${categoryIdToDelete}`);
                setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryIdToDelete));
                handleCloseDeleteModal();
                showToast.success("deleted success")
            } catch (error) {
                console.error("Error deleting category:", error);
                showToast.error("deleted erorr")
            }
        }
    };

    return (
        <>
            <Navbar role="admin" />

            <Container sx={{ color: 'white', paddingTop: '120px' }}>
                <Typography variant="h4" gutterBottom sx={{ ml: "15px" }}>
                    List Category
                </Typography>
                <Box display={'flex'} justifyContent={'flex-end'}>
                    <Link to={'/add-category'}>

                        <Button variant='contained' sx={{ backgroundColor: "#ff4b4b", color: "white", mb: "-10px" }}>
                            Add category
                        </Button>
                    </Link>
                </Box>


                <TableContainer component={Paper} sx={{ color: "white", margin: '20px', backgroundColor: '#303030', overflowY: "auto", maxHeight: 400 }}>
                    <Table stickyHeader sx={{ minWidth: "400px" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: "#404040", color: 'white', paddingRight: "90px" }}>No</TableCell>
                                <TableCell sx={{ backgroundColor: "#404040", color: 'white' }}>Category Name</TableCell>
                                <TableCell sx={{ backgroundColor: "#404040", color: 'white', paddingRight: "320px", textAlign: "right" }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((category, index) => (
                                <TableRow
                                    key={category.id}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? '#232323' : '#303030',
                                        color: "white"
                                    }}
                                >
                                    <TableCell sx={{ borderBottom: '1px solid #444444', color: "white" }}>{index + 1}</TableCell>
                                    <TableCell sx={{ borderBottom: '1px solid #444444', color: "white" }}>{category.name}</TableCell>
                                    <TableCell sx={{ borderBottom: '1px solid #444444', color: "white", textAlign: "right", paddingRight: "150px" }}>
                                        <Link to={`/edit-category/${category.id}`}>
                                            <Button variant="contained" sx={{ padding: { xs: "5px 20px", sm: "5px 40px" }, backgroundColor: '#59be5e', color: 'white', marginRight: '8px', textTransform: "none" }}>
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="contained"
                                            sx={{ padding: { xs: "5px 20px", sm: "5px 40px" }, backgroundColor: '#f74d4d', color: 'white', textTransform: "none" }}
                                            onClick={() => handleDeleteOpen(category.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>

            {/* Modal Delete Confirmation */}
            <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
                <DialogTitle sx={{ backgroundColor: "#000", color: "white" }}>Delete Confirmation</DialogTitle>
                <DialogContent sx={{ backgroundColor: "#000", color: "white" }}>
                    <DialogContentText sx={{ color: "white" }}>
                        Are you sure you want to delete this item? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: "#000" }}>
                    <Button onClick={handleCloseDeleteModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
