import React from "react";
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Alert,
    Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

const RegisterForm = ({ onRegister }) => {
    const [error, setError] = React.useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        formData.append("date_of_birth", formData.get("date_of_birth"));

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/accounts/register",
                formData
            );

            if (response.status === 201) {
                const token = response.headers.authorization;
                localStorage.setItem("token", token);

                if (onRegister) {
                    onRegister(response.data);
                }
            }
        } catch (err) {
            if (err.response && err.response.data) {
                const errors = Object.values(err.response.data).flat();
                setError(errors);
            } else {
                setError(["An error occurred. Please try again."]);
            }
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                Register
            </Typography>
            <Typography align="center">
                <Link component={RouterLink} to="/login">
                    Back to login
                </Link>
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="first_name"
                    label="First Name"
                    name="first_name"
                    autoComplete="given-name"
                    autoFocus
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="last_name"
                    label="Last Name"
                    name="last_name"
                    autoComplete="family-name"
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="date_of_birth"
                    label="Date of Birth"
                    name="date_of_birth"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Register
                </Button>
                {error &&
                    error.map((err, index) => (
                        <Alert key={index} severity="error" sx={{ mt: 2 }}>
                            {err}
                        </Alert>
                    ))}
            </Box>
        </Container>
    );
};

export default RegisterForm;
