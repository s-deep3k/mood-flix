
import { useEffect, useState } from 'react';
import Search from './components/Search.jsx';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
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
  const [loading, setLoading] = useState(false);

  const API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    },
  };

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

  useEffect(() => {
      fetchMovies(searchTerm)
  }, [searchTerm]);
  return (
    <main>
      <div className="pattern"/> 
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> you'll enjoy without the hassle</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        <section className='all-movies'>
          <h2 className='mt-[20px]'>All Movies</h2>
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