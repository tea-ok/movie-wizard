import React from "react";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
    const handleRegister = () => {
        console.log("User registered!");
    };

    return (
        <div>
            <h1>Register</h1>
            <RegisterForm onSubmit={handleRegister} />
        </div>
    );
};

export default RegisterPage;
