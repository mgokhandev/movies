import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoviesAsync } from '../store/slices/moviesSlice';
import { RootState, AppDispatch } from '../store/store';

const MovieList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { apiResponse, status, error } = useSelector((state: RootState) => state.movies);

    const [title, setTitle] = useState('Pokemon');
    const [year, setYear] = useState('');
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchMoviesAsync({ title, year, type, page: page.toString() }));
        }
    }, [status, dispatch]);

    useEffect(() => {
        if (status === 'succeeded') {
            console.log('Movies fetched successfully:', apiResponse);
        }
        if (status === 'failed') {
            console.error('Failed to fetch movies:', error);
        }
    }, [status, apiResponse, error]);

    const handleSearch = () => {
        setPage(1);
        dispatch(fetchMoviesAsync({ title, year, type, page: '1' }));
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        dispatch(fetchMoviesAsync({ title, year, type, page: newPage.toString() }));
    };

    return (
        <div className="container mt-4">
            <h2>Movie List</h2>

            <div className="mb-3">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Search by title"
                    className="form-control mb-2"
                />
                <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Year (optional)"
                    className="form-control mb-2"
                />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="form-control mb-2"
                >
                    <option value="">All</option>
                    <option value="movie">Movies</option>
                    <option value="series">Series</option>
                    <option value="episode">Episodes</option>
                </select>
                <button onClick={handleSearch} className="btn btn-primary">
                    Search
                </button>
            </div>

            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <p className="text-danger">Error: {error}</p>}

            {apiResponse?.Search && apiResponse.Search.length > 0 ? (
                <>
                    <table className="table table-striped table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Year</th>
                                <th scope="col">Type</th>
                                <th scope="col">IMDb ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiResponse.Search.map((movie: any) => (
                                <tr key={movie.imdbID}>
                                    <td>{movie.Title}</td>
                                    <td>{movie.Year}</td>
                                    <td>{movie.Type}</td>
                                    <td>{movie.imdbID}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <button
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}
                            className="btn btn-secondary"
                        >
                            Previous
                        </button>
                        <span>Page {page}</span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            className="btn btn-secondary"
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                status === 'succeeded' && <p className="text-muted">No movies found.</p>
            )}
        </div>
    );
};

export default MovieList;
