import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Box, CircularProgress, Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Navbar } from "../navbar/navbar";
import { apiV1 } from "../../../../libs/api"; // Import axios instance

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null); // Untuk menyimpan transaksi yang dipilih
    const [openDialog, setOpenDialog] = useState(false); // Untuk mengontrol tampilan dialog detail transaksi

    const salesData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // Months
        datasets: [
            {
                label: "Penjualan (Rp)",
                data: [1000000, 2000000, 1500000, 2500000, 3000000, 4000000], // Dummy sales data
                borderColor: "#4caf50",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                fill: true,
                tension: 0.4, // Smooth line
            }
        ]
    };

    // Fetch transactions on component mount
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await apiV1.get('/checkout/getAll');
                console.log(response.data); // Check the structure of the response

                setTransactions(response.data);
                setLoading(false);
                setLoadingTransactions(false);
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setLoading(false);
                setLoadingTransactions(false);
            }
        };

        fetchTransactions();
    }, []);

    // Handle klik untuk melihat detail transaksi
    const handleTransactionClick = async (id: number) => {
        try {
            const response = await apiV1.get(`/checkout/get/${id}`);
            setSelectedTransaction(response.data);
            setOpenDialog(true);
        } catch (error) {
            console.error("Error fetching transaction details:", error);
        }
    };

    // Loading spinner while waiting for transactions
    if (loading || loadingTransactions) return <CircularProgress sx={{ color: "white" }} />;

    return (
        <>
            <Navbar role="admin" />
            <Container
                sx={{
                    color: "white",
                    paddingTop: "100px",
                    maxWidth: "lg",
                    height: "calc(100vh - 20px)",
                    overflow: "hidden",
                }}
            >
                <Paper sx={{ padding: "20px", backgroundColor: "#303030", color: "white", height: "100%", overflow: "hidden" }}>
                    <Typography variant="h4" sx={{ marginBottom: "20px" }}>
                        Admin Dashboard
                    </Typography>

                    {/* Stats */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography>Total Sales</Typography>
                            <Typography variant="h6">Rp 10,000,000</Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography>Total Orders</Typography>
                            <Typography variant="h6">250</Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography>Total Users</Typography>
                            <Typography variant="h6">500</Typography>
                        </Box>
                    </Box>

                    <Grid container spacing={4} sx={{ height: "calc(100vh - 200px)", overflow: "hidden" }}>
                        {/* Left - Line chart */}
                        <Grid item xs={12} sm={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                            <Box sx={{ marginBottom: "30px", flexGrow: 1, overflow: "hidden" }}>
                                <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                                    Penjualan Per Bulan
                                </Typography>
                                {/* Ensure the chart takes up available space */}
                                <Box sx={{ height: "100%", width: "100%" }}>
                                    <Line data={salesData} options={{ responsive: true }} />
                                </Box>
                            </Box>
                        </Grid>

                        {/* Right - Transaction Management */}
                        <Grid item xs={12} sm={6} sx={{ height: "100%", overflowY: "auto" }}>
                            <Box sx={{ marginTop: "40px", height: "100%", overflowY: "auto" }}>
                                <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                                    Transaction Management
                                </Typography>
                                {transactions.map(transaction => (
                                    <Paper
                                        key={transaction.id}
                                        sx={{
                                            padding: "10px",
                                            backgroundColor: "#424242",
                                            marginBottom: "10px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            cursor: "pointer", // Add cursor to indicate clickability
                                        }}
                                        onClick={() => handleTransactionClick(transaction.id)} // Handle click event
                                    >
                                        <Box>
                                            <Typography><strong>Transaction ID:</strong> {transaction.id}</Typography>
                                            <Typography><strong>Status:</strong> {transaction.status}</Typography>
                                            <Typography><strong>Total:</strong> Rp {transaction.totalAmount.toLocaleString()}</Typography>
                                            <Typography><strong>Created At:</strong> {new Date(transaction.createdAt).toLocaleString()}</Typography>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Modal for Transaction Detail */}
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    maxWidth="md"
                    fullWidth
                    sx={{
                        "& .MuiDialog-paper": {
                            backgroundColor: "#121212", // Dark background color
                            color: "white", // White text color
                            borderRadius: "8px", // Optional, to make the modal corners rounded
                        }
                    }}
                >
                    <DialogTitle sx={{ color: "white" }}>Transaction Detail</DialogTitle>
                    <DialogContent sx={{ color: "white" }}>
                        {selectedTransaction ? (
                            <Box>
                                <Typography variant="h6"><strong>Transaction ID:</strong> {selectedTransaction.id}</Typography>
                                <Typography><strong>Status:</strong> {selectedTransaction.status}</Typography>
                                <Typography><strong>Total Amount:</strong> Rp {selectedTransaction.totalAmount.toLocaleString()}</Typography>
                                <Typography><strong>Created At:</strong> {new Date(selectedTransaction.createdAt).toLocaleString()}</Typography>

                                <Typography variant="h6" sx={{ marginTop: "20px" }}><strong>Products Purchased:</strong></Typography>

                                {selectedTransaction.orderItems && selectedTransaction.orderItems.map((orderItem: any) => (
                                    <Box key={orderItem.id} sx={{ marginBottom: "10px" }}>
                                        <Typography><strong>Product Name:</strong> {orderItem.product.productName}</Typography>
                                        <Typography><strong>Quantity:</strong> {orderItem.quantity}</Typography>
                                        <Typography><strong>Price:</strong> Rp {orderItem.product.price.toLocaleString()}</Typography>
                                        <img src={orderItem.product.photo} alt={orderItem.product.productName} style={{ maxWidth: "100px", marginTop: "10px" }} />
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <CircularProgress sx={{ color: "white" }} />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
}

export default AdminDashboard;
