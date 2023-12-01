import React, { useState } from "react";
import { TextField, Button, Grid } from "@mui/material";
import axios from "axios";

const LoginForm = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/accounts/login",
                formData
            );

            if (response.status === 200) {
                // Log the token from the auth header
                const token = response.headers.authorization;
                console.log("Login successful. Token:", token);

                if (onLogin) {
                    onLogin(response.data);
                }
            } else {
                console.error(
                    "Login failed. Unexpected status:",
                    response.status
                );
            }
        } catch (error) {
            if (error.response) {
                console.error(
                    "Login failed. Server responded with:",
                    error.response.data
                );
            } else {
                console.error("Login failed. Error:", error.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                        Login
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default LoginForm;
