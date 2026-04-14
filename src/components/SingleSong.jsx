import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner'
import supabase from '../lib/supabase';
import RadarChart from './RadarChart.jsx';

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

function SingleSong({ playlists, setPlaylists, currentPlaylistId }) {
    const { id } = useParams();
    const [song, setSong] = useState(null);
    const [relatedSongs, setRelatedSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playlistMessage, setPlaylistMessage] = useState('');

    function handleAddToPlaylist() {
        if (!currentPlaylistId) {
            setPlaylistMessage('Please select a playlist first.');
            return;
        }

        const updatedPlaylists = playlists.map((playlist) => {
            if (playlist.id !== currentPlaylistId) {
                return playlist;
            }

            const alreadyInPlaylist = playlist.songs.some(
                (playlistSong) => playlistSong.id === song.id
            );

            if (alreadyInPlaylist) {
                setPlaylistMessage('Song is already in this playlist.');
                return playlist;
            }

            setPlaylistMessage('Song added to playlist.');

            return {
                ...playlist,
                songs: [...playlist.songs, song]
            };
        });

        setPlaylists(updatedPlaylists);
    }
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
            <main className="single-song-page">
                <div className="songs-header">
                    <h1 className="songs-title">{song.title}</h1>
                    <p className="songs-subtitle">{song.artist} — {song.year}</p>
                </div>

                {/* Top visual row: artist image (left) and radar chart (right), spanning width */}
                <div className="my-4">
                    <div className="d-flex flex-column flex-md-row align-items-stretch gap-4 mb-4">
                        <div className="flex-fill d-flex justify-content-center align-items-center">
                            <img
                                src={song.artist_image_url || '/fallback-artist.jpg'}
                                alt={song.artist}
                                className="single-artist-image rounded"
                                style={{ width: 420, height: 420 }}
                            />
                        </div>

                        <div className="flex-fill d-flex justify-content-center align-items-center">
                            <div style={{ width: '100%', maxWidth: 520 }}>
                                <h5 className="text-center">Audio Profile</h5>
                                <div style={{ height: 420 }}>
                                    <RadarChart song={song} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details (centered, large) */}
                    <div className="song-details text-center my-4">
                        <h1 className="detail-title mb-2">Genre: <Link to={`/genre/${song.genre_id}`}>{song.genre}</Link></h1>
                        <h1 className="detail-title mb-3">BPM: {song.bpm} · Popularity: {song.popularity} · Loudness: {song.loudness}</h1>

                        <div>
                            <button className="btn btn-purple btn-lg" onClick={handleAddToPlaylist}>
                                Add to playlist
                            </button>

                            {playlistMessage && (
                                <p className="mt-2 mb-0 text-muted">{playlistMessage}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="related-songs p-4 rounded-4 mb-4">
                    <h2 className="mb-3 text-center">Related Songs</h2>
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