import React, { useState, useEffect } from "react";
import { TextField, Button, Grid } from "@mui/material";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import axios from "axios";

const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({});
    const [searchResults, setSearchResults] = useState([]);
    const [nextPage, setNextPage] = useState(null);

    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async () => {
        try {
            if (!searchTerm) {
                console.log("Please enter a search term");
                return;
            }

            const apiUrl = "http://127.0.0.1:8000/api/titles/";
            const queryParams = {
                page: 1,
                primary_title: searchTerm,
                ...filters,
            };

            const token = localStorage.getItem("token");
            const response = await axios.get(apiUrl, {
                params: queryParams,
                headers: {
                    Authorization: token,
                },
            });

            setSearchResults(response.data.results);
            setNextPage(response.data.next);
        } catch (error) {
            console.error("Error fetching search results:", error.message);
        }
    };

    const handleLoadMore = async () => {
        try {
            if (!nextPage) {
                console.log("No more results to load");
                return;
            }

            const response = await axios.get(nextPage, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            setSearchResults((prevResults) => [
                ...prevResults,
                ...response.data.results,
            ]);
            setNextPage(response.data.next); // Update the nextPage state with the new next page URL
        } catch (error) {
            console.error("Error fetching more results:", error.message);
        }
    };

    return (
        <div>
            <h1>Home Page</h1>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                </Grid>
            </Grid>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title Type</TableCell>
                            <TableCell>Primary Title</TableCell>
                            <TableCell>Original Title</TableCell>
                            <TableCell>Is Adult</TableCell>
                            <TableCell>Start Year</TableCell>
                            <TableCell>Runtime Minutes</TableCell>
                            <TableCell>Genres</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {searchResults.map((result) => (
                            <TableRow key={result.id}>
                                <TableCell>{result.title_type}</TableCell>
                                <TableCell>{result.primary_title}</TableCell>
                                <TableCell>{result.original_title}</TableCell>
                                <TableCell>
                                    {result.is_adult ? "Yes" : "No"}
                                </TableCell>
                                <TableCell>{result.start_year}</TableCell>
                                <TableCell>{result.runtime_minutes}</TableCell>
                                <TableCell>{result.genres}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {nextPage && (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleLoadMore}
                >
                    Load More
                </Button>
            )}
        </div>
    );
};

export default HomePage;
