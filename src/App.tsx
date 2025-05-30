// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import Search from './components/Search.jsx';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { getTrendingMovies, updateSearchTerm } from './appwrite.js';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  interface Movie {
    id: string;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    original_language: string;
  }

  const [movies, setMovies] = useState<Movie[]>([]); 
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    },
  };
  useDebounce(()=>{
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]);

  const fetchMovies = async (query='') => {
    try{
      setLoading(true);
      setErrorMsg('');
      const endpoint = 
      query?
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`:
      `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Unable to fetch movies');
      }
      const data = await response.json();
      if(data.Response==='False'){
        setErrorMsg(data.Error || 'Failed to fetch movies');
        setMovies([]);
        return;
      }
      setMovies(data.results || []);
      
      if(query && data.results.length > 0){
        await updateSearchTerm(query,data.results[0]);
      }
    }
    catch(error: unknown){
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('An unknown error occurred');
      }
    }
    finally {
      setLoading(false);
    }
  }
  const fetchTrendingMovies = async () => {
    try {
      const tMovies = await getTrendingMovies()
      setTrendingMovies(tMovies); 
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  }

  useEffect(() => {
      fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm]);
  useEffect(() => {
    fetchTrendingMovies();
  }, []);
  return (
    <main>
      <div className="pattern"/> 
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> you'll enjoy without the hassle</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie,index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt="movie-poster" />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2>All Movies</h2>
          {errorMsg && <p className="text-red-500">{errorMsg}</p>}
          {loading? (<Spinner/>) : errorMsg ? (<p className="text-red-500">{errorMsg}</p>)
          :
          (<ul>
            {movies.map((movie) => (<MovieCard key={movie?.id} movie={movie}/>))}
          </ul>)
        }
        </section>
      </div>
    </main>
  )
}

export default App