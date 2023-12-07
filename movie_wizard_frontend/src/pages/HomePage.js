import React, { useState } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    CircularProgress,
} from "@mui/material";
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
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

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
    const [genres, setGenres] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const handleReset = () => {
        setSearchTerm("");
        setTitleType("");
        setYear("");
        setRuntimeMinutes("");
        setRuntimeFilter("");
        setSortBy("primary_title");
        setSearchResults([]);
        setNextPage(null);
        setSortOrder("");
        setGenres([]);
    };

    const handleSearch = async () => {
        setIsLoading(true);
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
                genre: genres.join(","),
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
        setIsLoading(false);
    };

    const handleLoadMore = async () => {
        setIsLoadingMore(true);
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
        setIsLoadingMore(false);
    };

    const handleAddToWatchlist = async (titleId) => {
        const token = localStorage.getItem("token");
        const config = {
            headers: { Authorization: token },
        };

        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/watchlist/add?title_id=${titleId}`,
                {},
                config
            );

            if (response.status === 200) {
                setErrorMessage(
                    <>
                        This title is already in your watchlist. Check it out{" "}
                        <Link to="/watchlist">here</Link>.
                    </>
                );
                setOpen(true);
            } else if (response.status === 201) {
                setErrorMessage("Title was added to your watchlist.");
                setOpen(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    align="center"
                >
                    Movie Wizard - Home of the Best Movies and TV Shows
                </Typography>
                {/* Consider removing Box and replacing Typography with an h1 */}
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
                        <FormControl
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        >
                            <InputLabel>Title Type</InputLabel>
                            <Select
                                value={titleType}
                                onChange={(e) => setTitleType(e.target.value)}
                                label="Title Type"
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="movie">Movie</MenuItem>
                                <MenuItem value="tvseries">TV Series</MenuItem>
                                <MenuItem value="tvepisode">
                                    TV Episode
                                </MenuItem>
                                <MenuItem value="tvminiseries">
                                    TV Mini-Series
                                </MenuItem>
                                <MenuItem value="tvspecial">
                                    TV Special
                                </MenuItem>
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
                        <FormControl
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        >
                            <InputLabel>Runtime Filter</InputLabel>
                            <Select
                                value={runtimeFilter}
                                onChange={(e) =>
                                    setRuntimeFilter(e.target.value)
                                }
                                label="Runtime Filter"
                            >
                                <MenuItem value="above">Above</MenuItem>
                                <MenuItem value="below">Below</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        >
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
                                <MenuItem value="average_review">
                                    Average Rating
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        >
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
                        <FormControl
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        >
                            <InputLabel>Genres</InputLabel>
                            <Select
                                multiple
                                value={genres}
                                onChange={(e) => setGenres(e.target.value)}
                                label="Genres"
                                renderValue={(selected) => (
                                    <div>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </div>
                                )}
                            >
                                <MenuItem value="Documentary">
                                    Documentary
                                </MenuItem>
                                <MenuItem value="Action">Action</MenuItem>
                                <MenuItem value="Adult">Adult</MenuItem>
                                <MenuItem value="Adventure">Adventure</MenuItem>
                                <MenuItem value="Animation">Animation</MenuItem>
                                <MenuItem value="Biography">Biography</MenuItem>
                                <MenuItem value="Comedy">Comedy</MenuItem>
                                <MenuItem value="Crime">Crime</MenuItem>
                                <MenuItem value="Documentary">
                                    Documentary
                                </MenuItem>
                                <MenuItem value="Drama">Drama</MenuItem>
                                <MenuItem value="Family">Family</MenuItem>
                                <MenuItem value="Fantasy">Fantasy</MenuItem>
                                <MenuItem value="Film-Noir">Film-Noir</MenuItem>
                                <MenuItem value="Game-Show">Game-Show</MenuItem>
                                <MenuItem value="History">History</MenuItem>
                                <MenuItem value="Horror">Horror</MenuItem>
                                <MenuItem value="Music">Music</MenuItem>
                                <MenuItem value="Musical">Musical</MenuItem>
                                <MenuItem value="Mystery">Mystery</MenuItem>
                                <MenuItem value="News">News</MenuItem>
                                <MenuItem value="Reality-TV">
                                    Reality-TV
                                </MenuItem>
                                <MenuItem value="Romance">Romance</MenuItem>
                                <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
                                <MenuItem value="Short">Short</MenuItem>
                                <MenuItem value="Sport">Sport</MenuItem>
                                <MenuItem value="Talk-Show">Talk-Show</MenuItem>
                                <MenuItem value="Thriller">Thriller</MenuItem>
                                <MenuItem value="War">War</MenuItem>
                                <MenuItem value="Western">Western</MenuItem>
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
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                    </Grid>
                </Grid>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <div>
                        <TableContainer>
                            <Table>
                                {searchResults.length > 0 && (
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title Type</TableCell>
                                            <TableCell>Primary Title</TableCell>
                                            <TableCell>
                                                Original Title
                                            </TableCell>
                                            <TableCell>Year</TableCell>
                                            <TableCell>
                                                Runtime Minutes
                                            </TableCell>
                                            <TableCell>Genres</TableCell>
                                            <TableCell>
                                                Average Rating
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                )}
                                <TableBody>
                                    {searchResults.map((result, index) => {
                                        return (
                                            <TableRow key={result.id || index}>
                                                <TableCell>
                                                    {result.title_type}
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        to={`/titles/${result.id}`}
                                                    >
                                                        {result.primary_title}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {result.original_title}
                                                </TableCell>
                                                <TableCell>
                                                    {result.start_year}
                                                </TableCell>
                                                <TableCell>
                                                    {result.runtime_minutes}
                                                </TableCell>
                                                <TableCell>
                                                    {result.genres}
                                                </TableCell>
                                                <TableCell>
                                                    {result.average_review}
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() =>
                                                            handleAddToWatchlist(
                                                                result.id
                                                            )
                                                        }
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {isLoadingMore ? (
                                <CircularProgress />
                            ) : (
                                nextPage && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleLoadMore}
                                    >
                                        Load More
                                    </Button>
                                )
                            )}
                        </div>
                    </div>
                )}
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={() => setOpen(false)}
                >
                    <Alert onClose={() => setOpen(false)} severity="info">
                        {errorMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </div>
    );
};

export default HomePage;
