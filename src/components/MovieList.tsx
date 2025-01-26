import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoviesAsync } from '../store/slices/moviesSlice';
import { RootState, AppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';

const MovieList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { apiResponse, status, error } = useSelector((state: RootState) => state.movies);

    const [title, setTitle] = useState('Pokemon');
    const [year, setYear] = useState('');
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchMoviesAsync({ title, year, type, page: page.toString() }));
    }, [dispatch, title, year, type, page]);
    

    const handleSearch = () => {
        setPage(1);
        dispatch(fetchMoviesAsync({ title, year, type, page: '1' }));
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        dispatch(fetchMoviesAsync({ title, year, type, page: newPage.toString() }));
    };

    const handleRowClick = (imdbID: string) => {
        navigate(`/movie/${imdbID}`);
    };

    const noMoviesFound =
        (status === 'succeeded' && (!apiResponse?.Search || apiResponse.Search.length === 0)) ||
        (status === 'failed' && (error === 'Movie not found!' || error === 'Series not found!'));

    const totalResults = parseInt(apiResponse?.totalResults || '0', 10);
    const resultsPerPage = 10;
    const startResult = (page - 1) * resultsPerPage + 1;
    const endResult = Math.min(page * resultsPerPage, totalResults);

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">Movie List</h2>

            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Search by title"
                        className="form-control"
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="Year (optional)"
                        className="form-control"
                    />
                </div>
                <div className="col-md-3">
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="form-select"
                    >
                        <option value="">All</option>
                        <option value="movie">Movies</option>
                        <option value="series">Series</option>
                        <option value="episode">Episodes</option>
                    </select>
                </div>
                <div className="col-md-2 d-grid">
                    <button onClick={handleSearch} className="btn btn-primary">
                        Search
                    </button>
                </div>
            </div>

            {status === 'loading' && <p className="text-center">Loading...</p>}
            {status === 'failed' && error && <p className="text-danger text-center">Error: {error}</p>}
            {noMoviesFound && <p className="text-muted text-center">No movies found.</p>}

            {!noMoviesFound && apiResponse?.Search && apiResponse.Search.length > 0 && (
                <>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Year</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">IMDb ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apiResponse.Search.map((movie: any) => (
                                    <tr
                                        key={movie.imdbID}
                                        onClick={() => handleRowClick(movie.imdbID)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>{movie.Title}</td>
                                        <td>{movie.Year}</td>
                                        <td>{movie.Type}</td>
                                        <td>{movie.imdbID}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex flex-column align-items-center mt-4">
                        <p className="mb-2">
                            Showing {startResult} to {endResult} of {totalResults}
                        </p>
                        <div className="d-flex align-items-center">
                            <button
                                disabled={page === 1}
                                onClick={() => handlePageChange(page - 1)}
                                className="btn btn-secondary me-2"
                            >
                                Prev
                            </button>
                            <span className="fw-bold mx-3">Page {page}</span>
                            <button
                                disabled={endResult === totalResults}
                                onClick={() => handlePageChange(page + 1)}
                                className="btn btn-secondary ms-2"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MovieList;
