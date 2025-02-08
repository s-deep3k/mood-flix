
import { useEffect, useState } from 'react';
import Search from './components/Search.jsx';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchMovies = async () => {
    try{
      const endpoint = `${API_BASE_URL}/discover/movie/sort_by=popularity.desc`;
    }
    catch(error: Error){
      setErrorMsg(error?.message);
    }
  }

  useEffect(() => {
      fetchMovies()
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
          <h2>All Movies</h2>
          {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        </section>
      </div>
    </main>
  )
}

export default App