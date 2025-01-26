import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMovie } from "../../service/api";

interface Movie {
    Poster: string;
    Title: string;
    Type: string;
    Year: string;
    imdbID: string;
}

interface ApiResponse {
    Search?: Movie[];
    totalResults?: string;
    Title?: string;
    Year?: string;
    Rated?: string;
    Released?: string;
    Runtime?: string;
    Genre?: string;
    Director?: string;
    Writer?: string;
    Actors?: string;
    Plot?: string;
    Language?: string;
    Country?: string;
    Awards?: string;
    Poster?: string;
    Ratings?: { Source: string; Value: string }[];
    Metascore?: string;
    imdbRating?: string;
    imdbVotes?: string;
    imdbID?: string;
    Type?: string;
    totalSeasons?: string;
    Response: string;
    Error?: string;
}


interface MovieState {
    apiResponse: ApiResponse | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: MovieState = {
    apiResponse: null,
    status: "idle",
    error: null,
};

interface SearchParams {
    title?: string;
    year?: string;
    type?: string;
    page?: string;
    imdbID?: string;
}

export const fetchMoviesAsync = createAsyncThunk<ApiResponse, SearchParams>(
    "movies/fetchMovies",
    async ({ title, year, type, page }) => {
        return await fetchMovie({ title, year, type, page });
    }
);

export const fetchMovieByIdAsync = createAsyncThunk<ApiResponse, string>(
    "movies/fetchMovieById",
    async (imdbID) => {
        return await fetchMovie({ imdbID });
    }
);

const moviesSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMoviesAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchMoviesAsync.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.apiResponse = action.payload;
            })
            .addCase(fetchMoviesAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Something went wrong";
            })
            .addCase(fetchMovieByIdAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchMovieByIdAsync.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.apiResponse = action.payload;
            })
            .addCase(fetchMovieByIdAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Something went wrong";
            })
    },
});

export default moviesSlice.reducer;
