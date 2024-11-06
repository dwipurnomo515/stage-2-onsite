import { AppBar, Box, Button, IconButton, Toolbar } from "@mui/material";
import dumb from "../../../../assets/images/dumb.png"
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


interface NavbarProps {
    role: 'admin' | 'member';
}


export function Navbar({ role }: NavbarProps) {
    return (
        <AppBar
            position="fixed"
            sx={{ backgroundColor: "black" }}
        >
            <Toolbar>
                <IconButton edge="start" sx={{ ml: "10px" }}>
                    <Link to='/'>
                        <img src={dumb} alt="Logo" width={"60"} height={"60"} />
                    </Link>
                </IconButton>
                {role === "admin" ? (
                    <Box sx={{ ml: "auto", display: "flex" }}>
                        <Link to='/complain-A' style={{ textDecoration: "none", color: "inherit" }}>
                            <Button size="large" color="inherit">Complain</Button>
                        </Link>
                        <Link to='/category' style={{ textDecoration: "none", color: "inherit" }}>
                            <Button size="large" color="inherit">Category</Button>
                        </Link>
                        <Link to='/product' style={{ textDecoration: "none", color: "inherit" }}>
                            <Button size="large" color="inherit">Product</Button>
                        </Link>
                        <Link to='/logout' style={{ textDecoration: "none", color: "inherit" }}>
                            <Button size="large" color="inherit">Logout</Button>
                        </Link>
                    </Box>

                ) : (
                    <Box sx={{ ml: "auto", display: "flex" }}>
                        <Link to='/cart' style={{ textDecoration: "none", color: "inherit" }}>
                            <IconButton color="inherit">
                                <ShoppingCartIcon />
                            </IconButton>
                        </Link>
                        <Link to='/complain-U' style={{ textDecoration: "none", color: "inherit" }}>
                            <Button size="large" color="inherit">Complain</Button>
                        </Link>
                        <Link to='/profile' style={{ textDecoration: "none", color: "inherit" }}>
                            <Button size="large" color="inherit">Profile</Button>
                        </Link>
                        <Link to='/logout' style={{ textDecoration: "none", color: "inherit" }}>
                            <Button size="large" color="inherit">Logout</Button>
                        </Link>
                    </Box>


                )}



            </Toolbar>

        </AppBar>

    )
}