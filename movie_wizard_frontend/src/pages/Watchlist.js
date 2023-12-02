import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Card, CardContent } from "@mui/material";

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const username = localStorage.getItem("username");

    useEffect(() => {
        const fetchWatchlist = async () => {
            const token = localStorage.getItem("token");
            const config = {
                headers: { Authorization: token },
            };

            const response = await axios.get(
                "http://127.0.0.1:8000/api/watchlist",
                config
            );
            setWatchlist(response.data);
        };

        fetchWatchlist();
    }, []);

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 2 }}>
                {username}'s Watchlist
            </Typography>
            {watchlist.length === 0 ? (
                <Typography variant="h6">No titles in watchlist</Typography>
            ) : (
                watchlist.map((item) => (
                    <Card key={item.id} sx={{ my: 2 }}>
                        <CardContent>
                            <Typography variant="h6">
                                {item.title_details.primary_title}
                            </Typography>
                            <Typography variant="body1">
                                {item.title_details.genres}
                            </Typography>
                            {/* Add more details as needed */}
                        </CardContent>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default Watchlist;
