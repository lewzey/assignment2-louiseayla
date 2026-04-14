import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import duaImage from '../assets/dua.jpg';
import supabase from '../lib/supabase';
//import { getArtists } from '../../../scripts/playlist-artist-router';

function Artists(props) {

    const [artists, setArtists] = useState(null);

    useEffect(() => {
        if (typeof props.setIsLoading === 'function') {
            props.setIsLoading();
        }

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

            if (typeof props.setIsLoading === 'function') {
                props.setIsLoading(false);
            }
        }
        getArtists();
    }, [props.setIsLoading]);

    // display artists

    let artistsDisplay;

    if (artists === null) {
        artistsDisplay = null;
    } else if (artists.length === 0) {
        artistsDisplay = <p>No artists found.</p>;
    } else {
        artistsDisplay = artists.map((artist) => (
            <div key={artist.artist_id} className="card artist-card-item h-100">
                <img
                    src={artist.artist_image_url}
                    alt={artist.artist_name}
                    className="card-img-top artist-card-image"
                />
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title artist-card-title">
                        {artist.artist_name}
                    </h5>
                    <div className="mt-auto">
                        <Link to={`/artist/${artist.artist_id}`} className="btn btn-sm btn-purple">
                            View
                        </Link>
                    </div>
                </div>
            </div>
        ));
    }

    return (
        <main>
            {/*Image by"https://pixabay.com/users/pexels-2286921/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1838653" Pexels from https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1838653" Pixabay */}
            <div className="genre-image">
                <img
                    src={duaImage}
                    alt="Dua Lipa Concert"
                    className="artist-image"
                />
                <h1 className="genre-overlay-text">
                    Artists
                </h1>
            </div>
            <p className="justify-content-center">Learn a little bit more about artists you love!</p>
            <div className="artist-grid">
                {artistsDisplay}
            </div>
        </main>
    );
}

export default Artists;