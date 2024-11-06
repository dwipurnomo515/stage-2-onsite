import { Box, Button, Container, TextField, Typography } from "@mui/material";
import dumb from "../../../assets/images/dumb.png"
import { Link } from "react-router-dom";
import { useLogin } from "../hook/login";

export function LoginForm() {

    const { register, handleSubmit, onsubmit, errors } = useLogin();
    return (
        <Container
            sx={{
                display: "flex",
                height: "100vh",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#000",
                color: "#fff",
                padding: 0,
                margin: 0,
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    padding: "20px",
                    ml: "60px"
                }}
            >
                <Box
                    display="flex"
                    alignItems={"center"}
                    marginBottom={"20px"}
                    sx={{ color: "#fff" }}
                >
                    <img
                        src={dumb}
                        alt="DUMB merch"
                        width={"200"}
                        height={"200"}
                        style={{ marginRight: "10px" }}
                    />
                </Box>
                <Typography variant="h3" component="h2" className="tagline" gutterBottom color="white">
                    Easy, Fast and Reliable
                </Typography>
                <Typography color="grey" >
                    <span> Go shopping for merchandise, just go to dumb merch</span><br />
                    <span> shopping, the biggest merchandise in Indonesia.</span>

                </Typography>

                <Box mt={4}>
                    <Link to='/login'>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#F74D4D",
                                "&:Hover": { backgroundColor: "#ff1a1a" },
                                width: "100px",
                                height: "25px",
                                padding: "15px",
                                textTransform: "none",

                            }}
                        >
                            Login
                        </Button>
                    </Link>
                    <Link to='/register'>
                        <Button
                            sx={{
                                color: "#fff",
                                ml: "30px",
                                textTransform: "none",

                            }}
                        >
                            Register
                        </Button>
                    </Link>

                </Box>
            </Box>
            <Box
                component={"form"}
                className="login-box"
                onSubmit={handleSubmit(onsubmit)}
                sx={{
                    backgroundColor: '#1a1a1a',
                    padding: "30px",
                    flex: 1,
                    borderRadius: "10px",
                    maxWidth: "400px",
                    margin: "0 auto",
                }}
            >
                <Typography variant="h4" component={"h2"} color="#fff" marginBottom={"20px"} fontWeight={"600"}> {/* Tambahkan warna agar teks terlihat */}
                    Login
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ""}
                    slotProps={{
                        inputLabel: {
                            sx: {
                                color: "#ccc",
                            },
                        },
                    }}
                    sx={{
                        bgcolor: "#464646",
                        marginBottom: "10px",
                        input: { color: "#fff" },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#ccc",
                            },
                            "&:hover fieldset": {
                                borderColor: "#fff",
                            },
                        },
                    }}

                />

                <TextField
                    fullWidth
                    variant="outlined"
                    label="Password"
                    type="password"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ""}
                    slotProps={{
                        inputLabel: {
                            sx: {
                                color: "#ccc",
                            },
                        },
                    }}
                    sx={{
                        bgcolor: "#464646",
                        marginBottom: "10px",
                        input: { color: "#fff" },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#ccc",
                            },
                            "&:hover fieldset": {
                                borderColor: "#fff",
                            },
                        },
                    }}

                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        marginTop: "10px",
                        backgroundColor: "#F74D4D",
                        "&:hover": { backgroundColor: "#ff1a1a" },
                        textTransform: "none"
                    }}
                >
                    Login
                </Button>
            </Box>
        </Container>
    );
}
