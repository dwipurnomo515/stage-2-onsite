import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { apiV1 } from "../../../../libs/api";
import { showToast } from "../../../../utils/toast";
import { Navbar } from "../navbar/navbar";


interface product {
    id: number;
    photo: string;
    productName: string;
    productDesc: string;
    price: number;
    qty: number;
}



export function ListProduct() {
    const [lists, setLists] = useState<product[]>([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiV1.get('/product/get');
                console.log("ini product", res.data);
                setLists(res.data)

            } catch (error) {
                console.error("fetching error", error)
            }
        }

        fetchData();
    }, [])

    const handleOpenDeleteModal = (productId: number) => {
        setSelectedProductId(productId);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setSelectedProductId(null);
    };

    const handleDelete = async () => {
        if (selectedProductId) {
            try {
                await apiV1.delete(`/product/delete/${selectedProductId}`)
                setLists(prevLists => prevLists.filter(lists => lists.id !== selectedProductId));
                handleCloseDeleteModal();
                showToast.success("Delete Success")
            } catch (error) {
                console.error("error fetching", error)
                showToast.error("Delete failed")
            }
        }
    };

    return (
        <>
            <Navbar role="admin" />
            <Container sx={{ color: "white", paddingTop: "100px" }}>
                <Typography variant="h4" sx={{ marginBottom: "20px" }} >
                    List Product
                </Typography>

                <Box display={'flex'} justifyContent={'flex-end'}>
                    <Link to={'/add-product'}>
                        <Button variant="contained" sx={{ backgroundColor: "#ff4b4b", mb: "10px", mr: "20px" }}>
                            Add Product
                        </Button>
                    </Link>
                </Box>

                <TableContainer component={Paper} sx={{ color: "white", backgroundColor: "#303030", maxHeight: 400, overflowY: "auto" }}>
                    <Table stickyHeader sx={{ minWidth: "300px" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: "#404040", color: "white" }}>No</TableCell>
                                <TableCell sx={{ backgroundColor: "#404040", color: "white" }}>Photo</TableCell>
                                <TableCell sx={{ backgroundColor: "#404040", color: "white" }}>Product Name</TableCell>
                                <TableCell sx={{ backgroundColor: "#404040", color: "white" }}>Product Desc</TableCell>
                                <TableCell sx={{ backgroundColor: "#404040", color: "white" }}>Price</TableCell>
                                <TableCell sx={{ backgroundColor: "#404040", color: "white" }}>Qty</TableCell>
                                <TableCell sx={{ backgroundColor: "#404040", color: "white" }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lists.map((list, index) => (
                                <TableRow
                                    key={list.id}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? '#232323' : '#303030',
                                        color: "white"
                                    }}
                                >
                                    <TableCell sx={{ borderBottom: "1px solid #444444", color: "white" }}>{index + 1}</TableCell>
                                    <TableCell sx={{ borderBottom: "1px solid #444444", color: "white" }}>
                                        <img src={list.photo} alt={list.productName} style={{ width: "50px", objectFit: "cover" }} />
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: "1px solid #444444", color: "white" }}>{list.productName}</TableCell>
                                    <TableCell sx={{ borderBottom: "1px solid #444444", color: "white" }}>{list.productDesc}</TableCell>
                                    <TableCell sx={{ borderBottom: "1px solid #444444", color: "white" }}>{list.price}</TableCell>
                                    <TableCell sx={{ borderBottom: "1px solid #444444", color: "white" }}>{list.qty}</TableCell>
                                    <TableCell sx={{ borderBottom: "1px solid #444444", color: "white" }}>
                                        <div style={{ display: "inline-flex", gap: "10px" }}>
                                            <Link to={`/edit-product/${list.id}`}>
                                                <Button variant="contained" sx={{ padding: { xs: "5px 20px", sm: "5px 40px" }, backgroundColor: "#59be5e", textTransform: "none", marginRight: "8px" }}>
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="contained"
                                                sx={{ padding: { xs: "5px 20px", sm: "5px 40px" }, backgroundColor: "#f74d4d", textTransform: "none" }}
                                                onClick={() => handleOpenDeleteModal(list.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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

                </TableContainer>
            </Container>
        </>
    );
}
