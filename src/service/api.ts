import axios from 'axios';

const API_KEY = '******';
const BASE_URL = 'http://www.omdbapi.com/';

interface SearchParams {
    title: string;
    year?: string;
    type?: string;
    page?: string;
}

export async function fetchMovie(params: SearchParams) {
    const { title, year, type, page = 1 } = params;

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                apikey: API_KEY,
                s: title,
                y: year,
                type,
                page,
            },
        });

        if (response.data.Response === 'False') {
            throw new Error(response.data.Error);
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
}
