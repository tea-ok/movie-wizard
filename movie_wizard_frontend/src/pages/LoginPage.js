import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
    const handleLogin = async (userData) => {
        console.log(`Hello, ${userData.user.username}!`);

        // Put a redirect to titles page here
    };

    return (
        <div>
            <h1>Login</h1>
            <LoginForm onLogin={handleLogin} />
        </div>
    );
};

export default LoginPage;
