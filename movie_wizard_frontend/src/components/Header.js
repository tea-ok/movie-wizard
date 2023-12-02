import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();

    const handleWatchlist = () => {
        navigate("/watchlist"); // Go to the watchlist page
    };

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                await axios.post(
                    "http://127.0.0.1:8000/api/accounts/logout",
                    {},
                    {
                        headers: { Authorization: token },
                    }
                );
                localStorage.removeItem("token");
                localStorage.removeItem("username");

                navigate("/login");
            } catch (error) {
                console.error("Failed to logout", error);
            }
        }
    };

    const handleBack = () => {
        navigate(-1); // Go to the previous page
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleBack}
                    sx={{ mr: 2 }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Movie Wizard
                </Typography>
                <Button color="inherit" onClick={handleWatchlist}>
                    Watchlist
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
