import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import TitleDetailPage from "./pages/TitleDetailPage";
import Header from "./components/Header";
import Watchlist from "./pages/Watchlist";

// Layout component
const Layout = ({ children }) => (
    <div>
        <Header />
        {children}
    </div>
);

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/titles"
                    element={
                        <Layout>
                            <HomePage />
                        </Layout>
                    }
                />
                <Route
                    path="/titles/:titleId"
                    element={
                        <Layout>
                            <TitleDetailPage />
                        </Layout>
                    }
                />
                <Route
                    path="/watchlist"
                    element={
                        <Layout>
                            <Watchlist />
                        </Layout>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
