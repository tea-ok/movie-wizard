import React from "react";
import LoginForm from "../components/LoginForm";
import { Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLogin = async (userData) => {
        console.log(`Hello, ${userData.user.username}!`);
        // After successful login, redirect to /titles
        navigate("/titles");
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <Container maxWidth="xs">
                <LoginForm onLogin={handleLogin} />
            </Container>
        </Box>
    );
};

export default LoginPage;
