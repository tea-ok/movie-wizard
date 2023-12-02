import { Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
    const navigate = useNavigate();

    const handleRegister = (data) => {
        const username = data.user.username;
        localStorage.setItem("username", username);
        console.log(`Welcome to the platform, ${username}!`);
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
                <RegisterForm onRegister={handleRegister} />
            </Container>
        </Box>
    );
};

export default RegisterPage;
