import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner'
import supabase from '../lib/supabase';

function getSongMoods(song) {
    const results = [];

    if (song.danceability >= 70) {
        results.push('Dancing');
    }

    if (song.valence >= 70) {
        results.push('Happy');
    }

    if (song.acousticness > 0 && (song.liveness / song.acousticness) >= 1) {
        results.push('Coffee');
    }

    if ((song.energy * song.speechiness) <= 5) {
        results.push('Studying');
    }

    return results;
}

function getTopThreeMetrics(song) {
    const metrics = [
        { name: 'energy', value: song.energy },
        { name: 'danceability', value: song.danceability },
        { name: 'valence', value: song.valence },
        { name: 'acousticness', value: song.acousticness },
        { name: 'speechiness', value: song.speechiness },
        { name: 'liveness', value: song.liveness }
    ];

    metrics.sort((a, b) => b.value - a.value);

    return metrics.slice(0, 3);
}

function SingleSong() {
    const { id } = useParams();
    const [song, setSong] = useState(null);
    const [relatedSongs, setRelatedSongs] = useState([]);
    const [moods, setMoods] = useState([]);

    useEffect(() => {
        async function getSong() {

            // get single song
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
                        artist_name,
                        artist_image_url
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
                return;
            }

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
                genre_id: data.genres.genre_id,
                artist_image_url: data.artists.artist_image_url
            };

            setSong(mappedSong);
            setMoods(getSongMoods(mappedSong));

            // get all songs
            const { data: allSongsData, error: allSongsError } = await supabase
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
                .neq('song_id', id);

            if (allSongsError) {
                console.log(allSongsError);
                return;
            }

            // get related songs
            const topThree = getTopThreeMetrics(mappedSong);

            const related = allSongsData
                .map((item) => {
                    const candidate = {
                        id: item.song_id,
                        title: item.title,
                        year: item.year,
                        artist: item.artists.artist_name,
                        genre: item.genres.genre_name,
                        artist_id: item.artists.artist_id,
                        genre_id: item.genres.genre_id,
                        energy: item.energy,
                        danceability: item.danceability,
                        valence: item.valence,
                        acousticness: item.acousticness,
                        speechiness: item.speechiness,
                        liveness: item.liveness
                    };

                    let similarityScore = 0;

                    topThree.forEach((metric) => {
                        similarityScore += Math.abs(
                            candidate[metric.name] - mappedSong[metric.name]
                        );
                    });

                    return { ...candidate, similarityScore };
                })
                .sort((a, b) => a.similarityScore - b.similarityScore)
                .slice(0, 4);

            setRelatedSongs(related);
        }

        getSong();

    }, [id]);

    if (!song) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        )
    }

    return (
        <main>
            <h1>{song.title}</h1>
            <p>
                Artist: 
                <Link to={`/artist/${song.artist_id}`}>
                    {song.artist}
                </Link>
            </p>
            <p>Year: {song.year}</p>
            <p>
                Genre: 
                <Link to={`/genre/${song.genre_id}`}>
                    {song.genre}
                </Link>
            </p>
            <p>BPM: {song.bpm}</p>
            <p>Popularity: {song.popularity}</p>
            <p>Loudness: {song.loudness}</p>

            <h2>Moods</h2>
            {moods.length > 0 ? (
                <ul>
                    {moods.map((mood) => (
                        <li key={mood}>{mood}</li>
                    ))}
                </ul>
            ) : (
                <p>No moods matched.</p>
            )}

            <h2>Related Songs</h2>
            <ul>
                {relatedSongs.map((item) => (
                    <li key={item.id}>
                        <Link to={`/song/${item.id}`}>
                            {item.title} - {item.artist}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default SingleSong;