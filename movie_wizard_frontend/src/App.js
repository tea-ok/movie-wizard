import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
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

const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
};

const PrivateRoute = ({ element, path }) => {
    return isAuthenticated() ? (
        <Layout>{element}</Layout>
    ) : (
        <Navigate to="/login" replace state={{ from: path }} />
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/titles"
                    element={
                        <PrivateRoute path="/titles" element={<HomePage />} />
                    }
                />
                <Route
                    path="/titles/:titleId"
                    element={
                        <PrivateRoute
                            path="/titles/:titleId"
                            element={<TitleDetailPage />}
                        />
                    }
                />
                <Route
                    path="/watchlist"
                    element={
                        <PrivateRoute
                            path="/watchlist"
                            element={<Watchlist />}
                        />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
