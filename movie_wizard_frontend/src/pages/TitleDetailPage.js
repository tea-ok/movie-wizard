import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TitleDetailPage = () => {
    const { titleId } = useParams();
    const [titleDetails, setTitleDetails] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchTitleDetails = async () => {
            try {
                console.log("titleId retreived:", titleId);
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
        <div>
            <h1>{titleDetails.primary_title}</h1>
            <p>Title Type: {titleDetails.title_type}</p>
            <p>Original Title: {titleDetails.original_title}</p>
            <p>Adult-only title: {titleDetails.is_adult ? "Yes" : "No"}</p>
            <p>Start Year: {titleDetails.start_year}</p>
            <p>Runtime (in minutes): {titleDetails.runtime_minutes}</p>
            <p>Genres: {titleDetails.genres}</p>

            <h2>Reviews</h2>
            <ul>
                {reviews.map((review) => (
                    <li key={review.id}>
                        <h3>{review.user.username}</h3>
                        <h4>Rating: {review.rating}/5</h4>
                        <p>{review.text}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TitleDetailPage;
