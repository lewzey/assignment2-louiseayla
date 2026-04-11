import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import supabase from '../lib/supabase';
import SongList from './SongList.jsx';

function SingleGenre() {
  const { id } = useParams();
  const [genre, setGenre] = useState(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    async function getGenre() {
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .eq('genre_id', parseInt(id))
        .single();

      if (error) {
        console.log('genre error:', error);
      } else {
        setGenre(data);
      }

      const { data: songData, error: songError } = await supabase
        .from('songs')
        .select(`
          song_id,
          title,
          year,
          artist_id,
          genre_id,
          artists (
            artist_id,
            artist_name
          ),
          genres (
            genre_id,
            genre_name
          )
        `)
        .eq('genre_id', parseInt(id));

      if (songError) {
        console.log('song error:', songError);
      } else {
        const mappedSongs = songData.map((song) => ({
          id: song.song_id,
          title: song.title,
          year: song.year,
          artist: song.artists.artist_name,
          artist_id: song.artists.artist_id,
          genre: song.genres.genre_name,
          genre_id: song.genres.genre_id
        }));

        setSongs(mappedSongs);
      }
    }

    getGenre();
  }, [id]);

  if (!genre) {
    return <p>Genre not loaded.</p>;
  }

  let songsDisplay = <SongList songs={songs} />;

  return (
    <main>
      <h1>{genre.genre_name}</h1>
      <h2>Songs</h2>
      {songsDisplay}
    </main>
  );
}

export default SingleGenre;