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
} from "@mui/material";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
    margin: theme.spacing(2),
    padding: theme.spacing(2),
}));

const TitleDetailPage = () => {
    const { titleId } = useParams();
    const [titleDetails, setTitleDetails] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState("");
    const [text, setText] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);

    const handleClickOpenDelete = (id) => {
        setDeleteId(id);
        setDeleteOpen(true);
    };

    const handleClickOpenAdd = () => {
        setAddOpen(true);
    };

    const handleCloseDelete = () => {
        setDeleteOpen(false);
    };

    const handleCloseAdd = () => {
        setAddOpen(false);
    };
    const handleReview = async () => {
        const token = localStorage.getItem("token");
        const config = {
            headers: { Authorization: token },
        };

        const reviewData = {
            title: titleId,
            rating: rating,
            text: text,
        };

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
    };

    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        const config = {
            headers: { Authorization: token },
        };

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
            }
        };

        fetchTitleDetails();
    }, [titleId]);

    if (!titleDetails) {
        return <div>Loading...</div>;
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
                    <DialogContentText>
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
        </Item>
    );
};

export default TitleDetailPage;
