import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MovieList />} />
                <Route path="/movie/:imdbID" element={<MovieDetail />} />
            </Routes>
        </Router>
    );
};

export default App;
