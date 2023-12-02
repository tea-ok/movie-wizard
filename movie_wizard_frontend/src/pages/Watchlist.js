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
                <Typography variant="h6">
                    No titles in watchlist. Go back to the home page and add
                    some!
                </Typography>
            ) : (
                watchlist.map((item) => (
                    <Card key={item.id} sx={{ my: 2 }}>
                        <CardContent>
                            <Typography variant="h6">
                                Title: {item.title_details.primary_title}
                            </Typography>
                            <Typography variant="body1">
                                Title Type: {item.title_details.title_type}
                            </Typography>
                            <Typography variant="body2">
                                Year: {item.title_details.start_year}
                            </Typography>
                            <Typography variant="body2">
                                Runtime (in minutes):{" "}
                                {item.title_details.runtime_minutes}
                            </Typography>
                            <Typography variant="body2">
                                Genres: {item.title_details.genres}
                            </Typography>
                            <Typography variant="body2">
                                Adult title?:{" "}
                                {item.title_details.is_adult ? "Yes" : "No"}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default Watchlist;
