import css from './App.module.css'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import Loader from '../Loader/Loader'
import MovieGrid from '../MovieGrid/MovieGrid'
import MovieModal from '../MovieModal/MovieModal'
import SearchBar from '../SearchBar/SearchBar'
import { Toaster, toast }from 'react-hot-toast';
import type { Movie } from '../../types/movie';
import { useState } from 'react';
import { fetchMovies } from "../../services/movieService";



export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    setMovies([]);
    setIsLoading(true);
    setIsError(false);
  
    try {
      const movies = await fetchMovies(query);
      setIsError(false); 
      if (movies.length === 0) {
        toast("No movies found for your request", { duration: 6000 });
      } else {
        setMovies(movies);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" reverseOrder={false} />
  
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
  
      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid
          movies={movies}
          onSelect={(movie) => {
            setSelectedMovie(movie);
          }}
        />
      )}
  
      { selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => {
            setSelectedMovie(null);
          }}
        />
      )}
    </div>
  );
}  