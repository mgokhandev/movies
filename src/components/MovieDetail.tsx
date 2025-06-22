import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieByIdAsync } from '../store/slices/moviesSlice';
import { RootState, AppDispatch } from '../store/store';
import { useParams } from 'react-router-dom';

const MovieDetail: React.FC = () => {
    const { imdbID } = useParams<{ imdbID: string }>();
    const dispatch: AppDispatch = useDispatch();
    const { apiResponse, status, error } = useSelector((state: RootState) => state.movies);

    useEffect(() => {
        if (imdbID) {
            dispatch(fetchMovieByIdAsync(imdbID));
        }
    }, [imdbID, dispatch]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p className="text-danger">Error: {error}</p>;
    }

    if (!apiResponse || apiResponse.Response === 'False') {
        return <p className="text-muted">Movie not found.</p>;
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-4">
                    {apiResponse.Poster && apiResponse.Poster !== 'N/A' && (
                        <img
                            src={apiResponse.Poster}
                            alt={apiResponse.Title}
                            className="img-fluid rounded shadow"
                        />
                    )}
                </div>

                <div className="col-md-8">
                    <h2 className="mb-3">{apiResponse.Title}</h2>
                    <p><strong>Year:</strong> {apiResponse.Year}</p>
                    <p><strong>Duration:</strong> {apiResponse.Runtime}</p>
                    <p><strong>Genre:</strong> {apiResponse.Genre}</p>
                    <p><strong>Director:</strong> {apiResponse.Director}</p>
                    <p><strong>Writer:</strong> {apiResponse.Writer}</p>
                    <p><strong>Cast:</strong> {apiResponse.Actors}</p>
                    <p><strong>Plot:</strong> {apiResponse.Plot}</p>
                    <p><strong>Language:</strong> {apiResponse.Language}</p>
                    <p><strong>Country:</strong> {apiResponse.Country}</p>
                    <p><strong>Awards:</strong> {apiResponse.Awards}</p>
                    <p>
                        <strong>IMDb Rating:</strong> {apiResponse.imdbRating} / 10 (
                        {apiResponse.imdbVotes} votes)
                    </p>
                    {apiResponse.totalSeasons && (
                        <p><strong>Total Seasons:</strong> {apiResponse.totalSeasons}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;
