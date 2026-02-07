import type { Movie } from '../types/movie';
import axios from 'axios';

interface MovieHttpResponse {
  results: Movie[];
}

export async function fetchMovies(query: string): Promise<Movie[]> {
  const response = await axios.get<MovieHttpResponse>(
    `https://api.themoviedb.org/3/search/movie?query=${query}`,
    {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );

  return response.data.results;
}

