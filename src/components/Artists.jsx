import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../lib/supabase';
//import { getArtists } from '../../../scripts/playlist-artist-router';

function Artists() {
  
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    async function getArtists() {
        const { data, error } = await supabase
            .from('artists')
            .select('*')
            .order('artist_name', { ascending: true });

        if (error) {
            console.log(error);
        } else {
            setArtists(data);
        }
    }
    getArtists();
  }, []);
  
  // display artists

  let artistsDisplay;

  if (artists.length === 0) {
      artistsDisplay = <p>No artists found.</p>;
  } else {
      artistsDisplay = artists.map((artist) => (
          <p key={artist.artist_id}>
              <Link to={`/artist/${artist.artist_id}`}>{artist.artist_name}</Link>
          </p>
      ));
  }

  return (
    <main>
      <h1>Artists</h1>
      {artistsDisplay}
    </main>
  );
}

export default Artists;