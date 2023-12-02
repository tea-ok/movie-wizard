import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                await axios.post(
                    "http://127.0.0.1:8000/api/accounts/logout",
                    {},
                    {
                        headers: { Authorization: `Token ${token}` },
                    }
                );
                localStorage.removeItem("token");

                // Redirect to login page
                navigate("/login");
            } catch (error) {
                console.error("Failed to logout", error);
                // Handle error
            }
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    My App
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
