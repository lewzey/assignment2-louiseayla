import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import genreImage from '../assets/genres.jpg';
import ListGroup from 'react-bootstrap/ListGroup';
import supabase from '../lib/supabase';

function Genres(props) {

    const [genres, setGenres] = useState(null);

    useEffect(() => {
        if (typeof props.setIsLoading === 'function') {
            props.setIsLoading();
        }

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

            if (typeof props.setIsLoading === 'function') {
                props.setIsLoading(false);
            }
        }
        getGenres();
    }, [props.setIsLoading]);



    // display genres

    let genresDisplay;

    if (genres === null) {
        genresDisplay = null;
    } else if (genres.length === 0) {
        genresDisplay = <p>No genres found.</p>;
    } else {
        genresDisplay = genres.map((genre) => (
            <ListGroup.Item key={genre.genre_id} className="d-flex justify-content-between align-items-center">
                <Link to={`/genre/${genre.genre_id}`} className="list-item-title text-dark text-decoration-none flex-grow-1 me-2">
                    {genre.genre_name}
                </Link>
                <Link to={`/genre/${genre.genre_id}`} className="btn btn-sm btn-outline-primary btn-purple ms-2">
                    View
                </Link>
            </ListGroup.Item>
        ));
    }

    return (
        <main>
            {/* Image by https://pixabay.com/users/thorstenf-7677369/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4197733">Thorsten Frenzel from https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4197733" Pixabay */}
            <img src={genreImage} alt="Genres" className="artist-image mb-4 border border-dark rounded" />
            <h1>Genres</h1>
            <p className="justify-content-center"> Check out some more songs from your favourite genres!</p>
            <ListGroup variant="flush">
                {genresDisplay}
            </ListGroup>
        </main>
    );
}

export default Genres;