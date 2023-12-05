import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    IconButton,
    Button,
    Snackbar,
} from "@mui/material";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
    margin: theme.spacing(2),
    padding: theme.spacing(2),
}));

const TitleDetailPage = () => {
    const { titleId } = useParams();
    const [titleDetails, setTitleDetails] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState("");
    const [text, setText] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [updateOpen, setUpdateOpen] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [updateRating, setUpdateRating] = useState("");
    const [updateReview, setUpdateReview] = useState("");

    const handleClickOpenDelete = (id) => {
        setDeleteId(id);
        setDeleteOpen(true);
    };

    const handleClickOpenAdd = () => {
        setAddOpen(true);
    };

    const handleClickOpenUpdate = (id, rating, review) => {
        setUpdateId(id);
        setUpdateRating(rating || "");
        setUpdateReview(review || "");
        setUpdateOpen(true);
    };

    const handleCloseDelete = () => {
        setDeleteOpen(false);
    };

    const handleCloseAdd = () => {
        setAddOpen(false);
    };

    const handleCloseUpdate = () => {
        setUpdateOpen(false);
    };

    const handleReview = async () => {
        const token = localStorage.getItem("token");
        const config = {
            headers: { Authorization: token },
        };

        if (text === "") {
            setErrorMessage("Please enter a review.");
            return;
        }

        const reviewData = {
            title: titleId,
            rating: rating,
            text: text,
        };

        try {
            await axios.post(
                "http://127.0.0.1:8000/api/reviews/create",
                reviewData,
                config
            );
            handleCloseAdd();

            const response = await axios.get(
                `http://127.0.0.1:8000/api/reviews/?title_id=${titleId}`,
                config
            );
            setReviews(response.data);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                if (error.response.data.rating) {
                    // Server-side validation error, rating must be between 1 and 5
                    setErrorMessage(error.response.data.rating[0]);
                } else if (error.response.data.text) {
                    // Server-side validation error, text field is empty
                    setErrorMessage(error.response.data.text[0]);
                }
            } else if (error.response && error.response.status === 403) {
                setErrorMessage(
                    "Naughty, naughty! You can only update your own reviews!"
                );
            } else {
                // Handle other types of errors
                console.error(error);
            }
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        const config = {
            headers: { Authorization: token },
        };

        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/reviews/remove?review_id=${deleteId}`,
                config
            );
            handleCloseDelete();

            const response = await axios.get(
                `http://127.0.0.1:8000/api/reviews/?title_id=${titleId}`,
                config
            );
            setReviews(response.data);
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setErrorMessage(
                    "Naughty, naughty! You can only delete your own reviews!"
                );
            }
        }
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem("token");
        const config = {
            headers: { Authorization: token },
        };

        try {
            await axios.put(
                `http://127.0.0.1:8000/api/reviews/update?review_id=${updateId}`,
                { rating: updateRating, text: updateReview },
                config
            );
            handleCloseUpdate();

            const response = await axios.get(
                `http://127.0.0.1:8000/api/reviews/?title_id=${titleId}`,
                config
            );
            setReviews(response.data);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                if (error.response.data.rating) {
                    // Server-side validation error, rating must be between 1 and 5
                    setErrorMessage(error.response.data.rating[0]);
                } else if (error.response.data.text) {
                    // Server-side validation error, text field is empty
                    setErrorMessage(error.response.data.text[0]);
                }
            } else if (error.response && error.response.status === 403) {
                setErrorMessage(
                    "Naughty, naughty! You can only update your own reviews!"
                );
            }
        }
    };

    useEffect(() => {
        const fetchTitleDetails = async () => {
            try {
                const titleUrl = `http://127.0.0.1:8000/api/titles/title?id=${titleId}`;
                const reviewsUrl = `http://127.0.0.1:8000/api/reviews/?title_id=${titleId}`;

                const [titleResponse, reviewsResponse] = await Promise.all([
                    axios.get(titleUrl, {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    }),
                    axios.get(reviewsUrl, {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    }),
                ]);

                setTitleDetails(titleResponse.data);
                setReviews(reviewsResponse.data);
            } catch (error) {
                console.error(
                    "Error fetching title details or reviews:",
                    error.message
                );
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.error
                ) {
                    setErrorMessage(error.response.data.error);
                } else {
                    setErrorMessage("An error occurred. Please try again.");
                }
            }
        };

        fetchTitleDetails();
    }, [titleId]);

    if (!titleDetails) {
        return (
            <div>
                Loading...
                {errorMessage && (
                    <Snackbar
                        open={!!errorMessage}
                        autoHideDuration={6000}
                        onClose={() => setErrorMessage("")}
                        message={errorMessage}
                    />
                )}
            </div>
        );
    }

    return (
        <Item>
            <Typography variant="h4" gutterBottom>
                {titleDetails.primary_title}
            </Typography>
            <Typography variant="subtitle1">
                Title Type: {titleDetails.title_type}
            </Typography>
            <Typography variant="subtitle1">
                Original Title: {titleDetails.original_title}
            </Typography>
            <Typography variant="subtitle1">
                Adult-only title: {titleDetails.is_adult ? "Yes" : "No"}
            </Typography>
            <Typography variant="subtitle1">
                Start Year: {titleDetails.start_year}
            </Typography>
            <Typography variant="subtitle1">
                Runtime (in minutes): {titleDetails.runtime_minutes}
            </Typography>
            <Typography variant="subtitle1">
                Genres: {titleDetails.genres}
            </Typography>

            <Box display="flex" alignItems="flex-start" mt={2}>
                <Typography variant="h5" gutterBottom>
                    Reviews
                </Typography>
                <IconButton
                    edge="end"
                    onClick={handleClickOpenAdd}
                    style={{ marginTop: "-3px" }}
                >
                    <AddIcon />
                </IconButton>
            </Box>
            <List>
                {reviews.map((review) => (
                    <ListItem key={review.id}>
                        <ListItemText
                            primary={<strong>{review.user.username}</strong>}
                            secondary={
                                <>
                                    <strong>Rating:</strong> {review.rating}/5
                                    <br />
                                    {review.text}
                                </>
                            }
                        />
                        <IconButton
                            onClick={() =>
                                handleClickOpenUpdate(
                                    review.id,
                                    review.rating,
                                    review.review
                                )
                            }
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            edge="end"
                            onClick={() => handleClickOpenDelete(review.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
            <Dialog
                open={deleteOpen}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete review?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this review?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete}>Cancel</Button>
                    <Button onClick={handleDelete} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={addOpen} onClose={handleCloseAdd}>
                <DialogTitle>Add Review</DialogTitle>
                <DialogContent>
                    <DialogContentText component="div">
                        <TextField
                            autoFocus
                            margin="dense"
                            id="rating"
                            label="Rating"
                            type="number"
                            fullWidth
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            id="text"
                            label="Review"
                            type="text"
                            fullWidth
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAdd}>Cancel</Button>
                    <Button onClick={handleReview}>Submit</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={updateOpen} onClose={handleCloseUpdate}>
                <DialogTitle>Update Review</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="rating"
                        label="Rating"
                        type="number"
                        fullWidth
                        value={updateRating}
                        onChange={(e) => setUpdateRating(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="review"
                        label="Review"
                        type="text"
                        fullWidth
                        value={updateReview}
                        onChange={(e) => setUpdateReview(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUpdate} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
            {errorMessage && (
                <Snackbar
                    open={!!errorMessage}
                    autoHideDuration={6000}
                    onClose={() => setErrorMessage("")}
                    message={errorMessage}
                />
            )}
        </Item>
    );
};

export default TitleDetailPage;
