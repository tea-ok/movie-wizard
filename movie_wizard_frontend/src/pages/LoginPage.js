import React from "react";
import LoginForm from "../components/LoginForm";
import { Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLogin = async (userData) => {
        const username = userData.user.username;
        localStorage.setItem("username", username);
        console.log(`Hello, ${username}!`);
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
