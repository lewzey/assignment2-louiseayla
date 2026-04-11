import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import supabase from '../lib/supabase';

function SingleSong() {
    const { id } = useParams();

    /*
    // test songs
    const songs = [
        {id: 1, title: "Love Song", artist: "Artist A", year: 2018, genre: "Pop"},
        {id: 2, title: "Sky High", artist: "Artist B", year: 2020, genre: "Pop"},
        {id: 3, title: "Midnight", artist: "Artist C", year: 2016, genre: "Country"}
    ];
    

    // find the song
    const song = songs.find((s) => s.id === parseInt(id));
    */

    const [song, setSong] = useState(null);

    useEffect(() => {
        async function getSong() {
            const { data, error } = await supabase
                .from('songs')
                .select(`
                    song_id,
                    title,
                    year,
                    bpm,
                    energy,
                    danceability,
                    loudness,
                    liveness,
                    valence,
                    duration,
                    acousticness,
                    speechiness,
                    popularity,
                    artists (
                        artist_id,
                        artist_name
                    ),
                    genres (
                        genre_id,
                        genre_name
                    )
                `)
                .eq('song_id', id)
                .single();

            if (error) {
                console.log(error);
            } else {
                const mappedSong = {
                    id: data.song_id,
                    title: data.title,
                    year: data.year,
                    artist: data.artists.artist_name,
                    genre: data.genres.genre_name,
                    bpm: data.bpm,
                    energy: data.energy,
                    danceability: data.danceability,
                    loudness: data.loudness,
                    liveness: data.liveness,
                    valence: data.valence,
                    duration: data.duration,
                    acousticness: data.acousticness,
                    speechiness: data.speechiness,
                    popularity: data.popularity,
                    artist_id: data.artists.artist_id,
                    genre_id: data.genres.genre_id
                };

                setSong(mappedSong);
            }
        }

        getSong();
    }, [id]);

    if (!song) {
        return <p>Loading...</p>
    }

    return (
        <main>
            <h1>{song.title}</h1>
            <p>Artist: {song.artist}</p>
            <p>Year: {song.year}</p>
            <p>Genre: {song.genre}</p>
        </main>
    );
}

export default SingleSong;