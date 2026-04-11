import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../lib/supabase';

function Genres() {
  
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    async function getGenres() {
        const { data, error } = await supabase
            .from('genres')
            .select('*')
            .order('genre_name', { ascending: true });

        if (error) {
            console.log(error);
        } else {
            setGenres(data);
        }
    }
    getGenres();
  }, []);
  
  // display genres

  let genresDisplay;

  if (genres.length === 0) {
      genresDisplay = <p>No genres found.</p>;
  } else {
      genresDisplay = genres.map((genre) => (
          <p key={genre.genre_id}>
              <Link to={`/genre/${genre.genre_id}`}>{genre.genre_name}</Link>
          </p>
      ));
  }

  return (
    <main>
      <h1>Genres</h1>
      {genresDisplay}
    </main>
  );
}

export default Genres;