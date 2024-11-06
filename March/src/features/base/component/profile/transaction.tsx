import { Box, Card, CardContent, CardMedia, Grid2, Typography } from "@mui/material";
import dumb from "../../../../assets/images/dumb.png";

export function Transaction() {
    return (
        <Box sx={{ maxWidth: "1500px", margin: "0 auto", padding: "20px", color: "white" }}>
            <Typography variant="h5" sx={{ color: "#ff4c4c", marginBottom: "20px" }}>
                My Transaction
            </Typography>

            <Card sx={{ backgroundColor: "#333", padding: "10px", borderRadius: "8px", height: "200px" }}>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12, sm: 5 }}>
                        <CardMedia
                            component="img"
                            image="https://storage.googleapis.com/a1aa/image/3MPEgB3uq9LfV698inCVzoJJpL253M9wicmqIduicx46Ds0JA.jpg"
                            alt="Image"
                            sx={{ width: "100%", height: "auto", borderRadius: "5px" }}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 4 }}>
                        <CardContent>
                            <Typography variant="body1" color="#ff4c4c">
                                <span style={{ color: '#ff4c4c' }}>Mouse</span>
                                <br /> Saturday, 14 Januari 2022
                            </Typography>
                            <Typography variant="body2" sx={{ marginTop: '10px', color: 'white' }}>
                                Price: Rp. 500.000
                            </Typography>
                            <Typography color="white" variant="body2" marginTop={12}>Sub Total: 500.000</Typography>
                        </CardContent>
                    </Grid2>

                    <Grid2
                        sx={{ display: "flex", justifyContent: "center", alignItems: "center", pr: "20px" }}
                        size={{ xs: 12, sm: 3 }}
                    >
                        <img
                            src={dumb}
                            alt="Dumb Merch"
                            style={{ width: "100%", height: "auto", maxHeight: "100px", borderRadius: "5px" }} // Ubah ukuran untuk menyesuaikan
                        />
                    </Grid2>
                </Grid2>
            </Card>
        </Box>
    );
}
