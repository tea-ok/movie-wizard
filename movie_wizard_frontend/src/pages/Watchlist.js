import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const username = localStorage.getItem("username");
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const handleClickOpen = (id) => {
        setSelectedId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        const config = {
            headers: { Authorization: token },
        };

        await axios.delete(
            `http://127.0.0.1:8000/api/watchlist/remove?id=${selectedId}`,
            config
        );
        setWatchlist(watchlist.filter((item) => item.id !== selectedId));
        handleClose();
    };

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
                            <IconButton
                                edge="end"
                                onClick={() => handleClickOpen(item.id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </CardContent>
                    </Card>
                ))
            )}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Remove title from watchlist?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to remove this title from your
                        watchlist?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDelete} autoFocus>
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Watchlist;
