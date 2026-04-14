import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner'
import supabase from '../lib/supabase';
import RadarChart from './RadarChart.jsx';

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
    const [loading, setLoading] = useState(true);

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
                        artist_name,
                        artist_image_url
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
                        artist_image_url: item.artists.artist_image_url,
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
            setLoading(false);
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

    if (loading) {
        return (
            <div className="page-loader">
                <Spinner animation="border" />
            </div>
        );
    }
    else {
        return (
            <main className="container py-4">
                <div className="card shadow-lg p-4">
                    <h1 className="text-center mb-4">{song.title}</h1>

                    {/* Song Info */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <p>
                                <strong>Artist:</strong>{" "}
                                <Link to={`/artist/${song.artist_id}`}>
                                    {song.artist}
                                </Link>
                            </p>
                            <p>
                                <strong>Genre:</strong>{" "}
                                <Link to={`/genre/${song.genre_id}`}>
                                    {song.genre}
                                </Link>
                            </p>
                            <p><strong>Year:</strong> {song.year}</p>
                        </div>

                        <div className="col-md-6">
                            <p><strong>BPM:</strong> {song.bpm}</p>
                            <p><strong>Popularity:</strong> {song.popularity}</p>
                            <p><strong>Loudness:</strong> {song.loudness}</p>
                        </div>
                    </div>

                    {/* Moods + Chart */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h5>Moods</h5>
                            {moods.length > 0 ? (
                                <div className="d-flex flex-wrap gap-2">
                                    {moods.map((mood) => (
                                        <span key={mood} className="badge bg-secondary">
                                            {mood}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p>No moods matched.</p>
                            )}
                        </div>

                        <div className="col-md-6 text-center">
                            <h5>Audio Profile</h5>
                            <div style={{ height: "300px" }}>
                                <RadarChart song={song} />
                            </div>
                        </div>
                    </div>

                    {/* Related Songs */}
                    <div className="row">
                        {relatedSongs.map((song) => (
                            <div key={song.id} className="col-md-3 mb-3">
                                <div className="card h-100 shadow-sm">
                                    <img
                                        src={song.artist_image_url}
                                        className="card-img-top"
                                        alt={song.artist}
                                        style={{ height: "150px", objectFit: "cover" }}
                                    />
                                    <div className="card-body text-center">
                                        <Link to={`/song/${song.id}`} className="text-decoration-none">
                                            <h6 className="mb-1">{song.title}</h6>
                                            <p className="text-muted small mb-0">{song.artist}</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </main>
        )
    }
}
export default SingleSong;