import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CardMedia, Grid, Grid2, Typography } from '@mui/material';
import dumb from "../../../../assets/images/dumb.png"
import { Navbar } from '../navbar/navbar';
import { ProfileEntity } from '../../../../entities/profile';
import { apiV1 } from '../../../../libs/api';
import { Gender } from '../../../../entities/gender';
import EditProfileModal from './modal/edit.profile';

interface User {
    id: number;
    name: string;
    phone: number;
    photo: string;
    gender: Gender;
    address: string;
    user: {
        email: string;

    }
}


interface Transaction {
    id: number;
    createdAt: string;
    status: string;
    totalAmount: number;
    orderItems: OrderItem[];
}

interface OrderItem {
    id: number;
    quantity: number;
    product: {
        productName: string;
        photo: string;
        price: number;

    };
    totalPrice: number;
}
const Profile = () => {
    const [user, setUser] = useState<User>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiV1.get('/profile/getByUserId');
                console.log("ini data", res.data);

                setUser(res.data)

                const transactionsResponse = await apiV1.get(`/checkout/get`);
                console.log("ini data cek", transactionsResponse.data);

                setTransactions(transactionsResponse.data);
            } catch (error) {
                console.error("error fetching profile", error)

            }
        };
        fetchData();
    }, []);

    const handleEditProfile = () => {
        setIsModalOpen(true);
    }


    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleSaveProfile = (updatedData: User) => {

        setUser(updatedData)
        handleCloseModal();
    }

    return (
        <>
            <Navbar role='admin' />
            <Box sx={{
                backgroundColor: '#000', color: '#fff', overflow: "auto", minHeight: "100vh", paddingTop: '85px', paddingLeft: "20px"
            }}>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12, md: 8 }}>
                        <Typography variant="h5" sx={{ color: '#ff4b4b', marginBottom: '20px' }}>
                            My Profile
                        </Typography>

                        <Grid2 container spacing={4}>
                            <Grid2 size={{ xs: 12, md: 6 }}>
                                <CardMedia
                                    component="img"
                                    src={user?.photo}
                                    alt="Profile picture"
                                    sx={{ width: '100%', borderRadius: '5px', height: "400px" }}
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 12, md: 6 }}>
                                <Typography sx={{ marginBottom: "20px" }}>
                                    <strong>Name</strong><br /> {user?.name}
                                </Typography>
                                <Typography sx={{ marginBottom: "20px" }}>
                                    <strong>Email</strong><br /> {user?.user.email}
                                </Typography>
                                <Typography sx={{ marginBottom: "20px" }}>
                                    <strong>Phone</strong><br /> {user?.phone}
                                </Typography>
                                <Typography sx={{ marginBottom: "20px" }}>
                                    <strong>Gender</strong><br /> {user?.gender}
                                </Typography>
                                <Typography sx={{ marginBottom: "20px" }}>
                                    <strong>Address</strong>
                                    <Box
                                        sx={{
                                            maxHeight: "80px",
                                            overflowY: "auto",
                                            whiteSpace: "pre-wrap",
                                            wordWrap: "break-word"
                                        }}
                                    >
                                        <br /> {user?.address}
                                    </Box>
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginRight: "150px" }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleEditProfile}
                                        sx={{ backgroundColor: '#ff4b4b', color: '#fff', width: '50%' }}
                                    >
                                        Edit Profile
                                    </Button>
                                </Box>
                            </Grid2>
                        </Grid2>
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 4 }} paddingRight={"20px"}>
                        <Typography variant="h5" sx={{ color: '#ff4b4b', marginBottom: '20px' }}>
                            My Transactions
                        </Typography>

                        <Box sx={{
                            maxHeight: '400px',
                            overflowY: 'auto',
                        }}>
                            {transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <Card
                                        key={transaction.id}
                                        sx={{
                                            backgroundColor: '#333',
                                            border: 'none',
                                            padding: '10px',
                                            marginBottom: "10px",
                                            height: 'auto',
                                            display: 'flex',
                                            flexDirection: 'row', // Horizontal layout
                                            alignItems: 'center', // Vertically center content
                                        }}
                                    >
                                        {/* Left Side: Product Image */}
                                        <Grid2 size={{ xs: 3, sm: 3, md: 4 }} sx={{ padding: '10px' }}>
                                            {transaction.orderItems.map((item) => (
                                                <CardMedia
                                                    key={item.id}
                                                    component="img"
                                                    src={item.product.photo}
                                                    alt={item.product.productName || "No Product Name"}
                                                    sx={{
                                                        height: 120,
                                                        width: "100%",
                                                        borderRadius: '5px',
                                                        objectFit: 'contain',
                                                    }}
                                                />
                                            ))}
                                        </Grid2>


                                        {/* Middle: Product Info */}
                                        <Grid2 size={{ xs: 6, sm: 6, md: 6 }} sx={{ padding: '10px', textAlign: 'center' }}>
                                            {transaction.orderItems.map((item) => (
                                                <CardContent key={item.id}>
                                                    <Typography variant="h6" sx={{ color: '#e74c3c', fontSize: "14px" }}>
                                                        {item.product.productName || "Unknown Product"}
                                                    </Typography>
                                                    <Typography variant="subtitle2" sx={{ color: '#e74c3c', fontSize: "10px" }}>
                                                        {new Date(transaction.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                    <Typography sx={{ color: 'white', fontSize: "14px" }}>
                                                        Price: Rp. {item.product.price?.toLocaleString() || "N/A"}
                                                    </Typography>
                                                    <Typography sx={{ color: 'white', fontSize: "14px", pt: "10px" }}>
                                                        Sub Total: Rp. {item.totalPrice?.toLocaleString() || "N/A"}
                                                    </Typography>
                                                </CardContent>
                                            ))}
                                        </Grid2>

                                        {/* Right Side: Dummy Logo */}
                                        <Grid2 size={{ xs: 3, sm: 3, md: 3 }} sx={{ padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <CardMedia
                                                component="img"
                                                src={dumb}
                                                alt="Dummy Image"
                                                sx={{
                                                    height: 80, // Adjust height to make the logo smaller
                                                    width: "80%", // Adjust size as needed
                                                    borderRadius: '5px',
                                                    objectFit: 'contain', // Ensure the dummy image isn't cropped
                                                }}
                                            />
                                        </Grid2>
                                    </Card>
                                ))
                            ) : (
                                <Typography sx={{ color: "white", textAlign: "center", mt: 4 }}>
                                    No transactions found.
                                </Typography>
                            )}
                        </Box>
                    </Grid2>






                    <EditProfileModal
                        open={isModalOpen}
                        onClose={handleCloseModal}
                        userData={user}
                        onSave={handleSaveProfile}
                    />
                </Grid2>
            </Box >
        </>
    );
};

export default Profile;
