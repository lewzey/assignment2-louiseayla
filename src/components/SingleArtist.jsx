import { useParams } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import { getArtistById } from '../../../scripts/playlist-artist-router';
import { useState } from 'react';
import { useEffect } from 'react';
import supabase from '../lib/supabase';
import SongList from './SongList.jsx';

function SingleArtist() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);

  /*
  useEffect(() => {
    getArtistById(id).then(setArtist);
  }, [id]);

  return <div>{artist?.artist_name}</div>;
  */

  useEffect(() => {
    async function getArtist() {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('artist_id', parseInt(id))
        .single();

      if (error) {
        console.log(error);
      } else {
        setArtist(data);
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
        .eq('artist_id', parseInt(id));

      if (songError) {
        console.log(songError);
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
    getArtist();
  }, [id]);

  if (!artist) {
    return <p>Loading...</p>;
  }

  let songsDisplay = <SongList songs={songs} />;

  return (
    <main>
      <h1>{artist.artist_name}</h1>
      <h2>Songs</h2>
      {songsDisplay}
    </main>
  );
}

export default SingleArtist;