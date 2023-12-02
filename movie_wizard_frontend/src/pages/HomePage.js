import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
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
    const [titleType, setTitleType] = useState("");
    const [year, setYear] = useState("");
    const [runtimeMinutes, setRuntimeMinutes] = useState("");
    const [runtimeFilter, setRuntimeFilter] = useState("");
    const [sortBy, setSortBy] = useState("primary_title");
    const [searchResults, setSearchResults] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [sortOrder, setSortOrder] = useState("");

    const handleSearch = async () => {
        try {
            const apiUrl = "http://127.0.0.1:8000/api/titles/";
            const queryParams = {
                page: 1,
                primary_title: searchTerm,
                title_type: titleType === "all" ? undefined : titleType,
                year: year.trim() === "" ? undefined : year.trim(),
                runtime_minutes:
                    runtimeMinutes.trim() === ""
                        ? undefined
                        : runtimeMinutes.trim(),
                runtime_filter:
                    runtimeFilter === "all" ? undefined : runtimeFilter,
                sort_by: sortBy,
                sort_order: sortOrder,
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
                <Grid item xs={2}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>Title Type</InputLabel>
                        <Select
                            value={titleType}
                            onChange={(e) => setTitleType(e.target.value)}
                            label="Title Type"
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="movie">Movie</MenuItem>
                            <MenuItem value="tvseries">TV Series</MenuItem>
                            <MenuItem value="tvepisode">TV Episode</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="Year"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="Runtime Minutes"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={runtimeMinutes}
                        onChange={(e) => setRuntimeMinutes(e.target.value)}
                    />
                </Grid>
                <Grid item xs={2}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>Runtime Filter</InputLabel>
                        <Select
                            value={runtimeFilter}
                            onChange={(e) => setRuntimeFilter(e.target.value)}
                            label="Runtime Filter"
                        >
                            <MenuItem value="above">Above</MenuItem>
                            <MenuItem value="below">Below</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            label="Sort By"
                        >
                            <MenuItem value="primary_title">
                                Primary Title
                            </MenuItem>
                            <MenuItem value="runtime_minutes">
                                Runtime Minutes
                            </MenuItem>
                            <MenuItem value="start_year">Year</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>Sort Order</InputLabel>
                        <Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            label="Sort Order"
                        >
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
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
                            <TableCell>Year</TableCell>
                            <TableCell>Runtime Minutes</TableCell>
                            <TableCell>Genres</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {searchResults.map((result, index) => (
                            <TableRow key={result.id || index}>
                                <TableCell>{result.title_type}</TableCell>
                                <TableCell>{result.primary_title}</TableCell>
                                <TableCell>{result.original_title}</TableCell>
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
