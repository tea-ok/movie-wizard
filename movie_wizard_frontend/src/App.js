import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import TitleDetailPage from "./pages/TitleDetailPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/titles" element={<HomePage />} />
                <Route path="/titles/:titleId" element={<TitleDetailPage />} />
            </Routes>
        </Router>
    );
}

export default App;
