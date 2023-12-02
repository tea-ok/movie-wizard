import { Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
    const navigate = useNavigate();

    const handleRegister = (data) => {
        // Handle the registration data, e.g. save the user data or token
        // Then navigate to the /titles page
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
