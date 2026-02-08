import css from './App.module.css'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import Loader from '../Loader/Loader'
import MovieGrid from '../MovieGrid/MovieGrid'
import MovieModal from '../MovieModal/MovieModal'
import SearchBar from '../SearchBar/SearchBar'
import { Toaster, toast }from 'react-hot-toast';
import type { Movie } from '../../types/movie';
import { useState, useEffect } from 'react';
import { fetchMovies } from "../../services/movieService";
import {keepPreviousData, useQuery} from '@tanstack/react-query'
import ReactPaginate from 'react-paginate'



export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [topic, setTopic] = useState('');
  const [currentPage, setCurrentPage] = useState(1);


  const {data, isLoading, isError, isSuccess} = useQuery({
    queryKey: ['movieQuery', topic, currentPage],
    queryFn: ()=> fetchMovies(topic, currentPage),
    enabled: topic.trim().length > 0,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error('No movies found for your request');
    }
  }, [isSuccess, data]);

  const totalPages = data?.total_pages ?? 0;

  const handleSearch = (newTopic: string) => {
    setTopic(newTopic);
    setCurrentPage(1);
  };

  return (
    <>
      
    <SearchBar onSubmit={handleSearch}/>
      {isSuccess && totalPages > 1 && (
      <ReactPaginate 
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setCurrentPage(selected + 1)}
        forcePage={currentPage - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
        renderOnZeroPageCount={null}
      />
    )}
    {isLoading && <Loader />}
    {isError && <ErrorMessage />}
    {data && data.results.length > 0 && <MovieGrid movies={data.results} onSelect={setSelectedMovie}/>}
    {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    <Toaster/>
    </>
)
}