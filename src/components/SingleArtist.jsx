import { useParams } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import { getArtistById } from '../../../scripts/playlist-artist-router';
import { useState } from 'react';
import { useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner'
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
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  let songsDisplay = <SongList songs={songs} />;

  return (
    <main>
      <h1>{artist.artist_name}</h1>

      <div className="single-artist-detail d-flex flex-column flex-md-row align-items-start gap-4 my-4">
        <img
          src={artist.artist_image_url || '/fallback-artist.jpg'}
          alt={artist.artist_name}
          className="single-artist-image rounded"
        />

        <div className="single-artist-info d-flex flex-column gap-3">
          {(artist.description || artist.spotify_desc) && (
            <p className="artist-description mb-0">
              {artist.description || artist.spotify_desc}
            </p>
          )}

          {artist.spotify_url && (
            <a
              href={artist.spotify_url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-purple"
            >
              Listen this artist on Spotify!
            </a>
          )}
        </div>
      </div>

      <h2>Songs</h2>
      {songsDisplay}
    </main>
  );
}

export default SingleArtist;