import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
    Box,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
    margin: theme.spacing(2),
    padding: theme.spacing(2),
}));

const TitleDetailPage = () => {
    const { titleId } = useParams();
    const [titleDetails, setTitleDetails] = useState(null);
    const [reviews, setReviews] = useState([]);

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

            <Box mt={2}>
                <Typography variant="h5" gutterBottom>
                    Reviews
                </Typography>
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
                    </ListItem>
                ))}
            </List>
        </Item>
    );
};

export default TitleDetailPage;
