import { useState } from 'react';
import { useEffect } from 'react';
//import { Link } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';
import supabase from '../lib/supabase';
import SongList from './SongList.jsx';

function Songs({ playlists, setPlaylists, currentPlaylistId, setCurrentPlaylistId, setIsLoading, isLoggedIn }) {

    const [titleFilter, setTitleFilter] = useState("");
    const [yearFilter, setYearFilter] = useState([]);
    const [artistFilter, setArtistFilter] = useState([]);
    const [genreFilter, setGenreFilter] = useState([]);

    const [yearOpen, setYearOpen] = useState(false);
    const [artistOpen, setArtistOpen] = useState(false);
    const [genreOpen, setGenreOpen] = useState(false);

    const [sortBy, setSortBy] = useState("title");
    const [songs, setSongs] = useState([]);
    const [isFiltering, setIsFiltering] = useState(false);

    const [selectedPlaylist, setSelectedPlaylist] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState('success');
    const [showToast, setShowToast] = useState(false);

    // const currentPlaylistId = props.currentPlaylistId;
    // const setCurrentPlaylistId = props.setCurrentPlaylistId;

    const handleAddSong = (song) => {
        if (!isLoggedIn) {
            setToastVariant('danger');
            setToastMessage('Please log in to add songs to a playlist.');
            setShowToast(true);
            return;
        }

        if (selectedPlaylist === "") {
            setToastVariant('danger');
            setToastMessage('Please select a playlist first.');
            setShowToast(true);
            return;
        }

        const playlistId = parseInt(selectedPlaylist, 10);
        const playlistIndex = playlists.findIndex((playlist) => playlist.id === playlistId);
        const playlist = playlists[playlistIndex];

        if (!playlist) {
            return;
        }

        const alreadyExists = playlist.songs.some((item) => item.id === song.id);

        if (alreadyExists) {
            setToastVariant('danger');
            setToastMessage('This song is already in your playlist!');
            setShowToast(true);
            return;
        }

        const playlistName = playlist.name || 'playlist';
        const updatedPlaylists = [...playlists];

        updatedPlaylists[playlistIndex] = {
            ...updatedPlaylists[playlistIndex],
            songs: [...updatedPlaylists[playlistIndex].songs, song],
        };

        setPlaylists(updatedPlaylists);
        setToastVariant('success');
        setToastMessage(`Added "${song.title}" to ${playlistName}`);
        setShowToast(true);
    };

    useEffect(() => {
        if (typeof setIsLoading === 'function') {
            setIsLoading();
        }

        async function getSongs() {
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
                `);

            if (error) {
                console.log(error);
            } else {
                const mappedSongs = data.map((song) => ({
                    id: song.song_id,
                    title: song.title,
                    year: song.year,
                    artist: song.artists.artist_name,
                    genre: song.genres.genre_name,
                    bpm: song.bpm,
                    energy: song.energy,
                    danceability: song.danceability,
                    loudness: song.loudness,
                    liveness: song.liveness,
                    valence: song.valence,
                    duration: song.duration,
                    acousticness: song.acousticness,
                    speechiness: song.speechiness,
                    popularity: song.popularity,
                    artist_id: song.artists.artist_id,
                    genre_id: song.genres.genre_id
                }));

                setSongs(mappedSongs);
            }

            if (typeof setIsLoading === 'function') {
                setIsLoading(false);
            }
        }

        getSongs();
    }, [setIsLoading]);

    useEffect(() => {
        if (!isLoggedIn) {
            setSelectedPlaylist("");
            setCurrentPlaylistId(null);
        }
    }, [isLoggedIn, setCurrentPlaylistId]);

    // current playlist selection
    useEffect(() => {
        if (currentPlaylistId) {
            setSelectedPlaylist(String(currentPlaylistId));
        } else {
            setSelectedPlaylist("");
        }
    }, [currentPlaylistId]);

    const yearOptions = Array.from(new Set(songs.map((song) => song.year))).sort((a, b) => a - b);
    const artistOptions = Array.from(new Set(songs.map((song) => song.artist))).sort();
    const genreOptions = Array.from(new Set(songs.map((song) => song.genre))).sort();

    // filtered songs logic
    const filteredSongs = songs.filter((song) =>
        song.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
        (yearFilter.length === 0 || yearFilter.includes(song.year)) &&
        (artistFilter.length === 0 || artistFilter.includes(song.artist)) &&
        (genreFilter.length === 0 || genreFilter.includes(song.genre))
    );

    // sorting logic
    let sortedSongs = [...filteredSongs];

    if (sortBy === "title") {
        sortedSongs.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortBy === "year") {
        sortedSongs.sort((a, b) => a.year - b.year);
    }

    if (sortBy === "artist") {
        sortedSongs.sort((a, b) => a.artist.localeCompare(b.artist));
    }

    if (sortBy === "genre") {
        sortedSongs.sort((a, b) => a.genre.localeCompare(b.genre));
    }

    // display results
    let results;

    results = (
        <SongList
            songs={sortedSongs}
            playlists={playlists}
            selectedPlaylist={selectedPlaylist}
            onAddSong={handleAddSong}
        />
    );

    // active filters
    let activeFilters = [];

    if (titleFilter !== "") {
        activeFilters.push("Title: " + titleFilter);
    }

    yearFilter.forEach((year) => {
        activeFilters.push("Year: " + year);
    });

    artistFilter.forEach((artist) => {
        activeFilters.push("Artist: " + artist);
    });

    genreFilter.forEach((genre) => {
        activeFilters.push("Genre: " + genre);
    });

    const removeActiveFilter = (filter) => {
        if (filter.startsWith("Title: ")) {
            setTitleFilter("");
            return;
        }

        if (filter.startsWith("Year: ")) {
            const yearValue = parseInt(filter.replace("Year: ", ""), 10);
            setYearFilter((prev) => prev.filter((item) => item !== yearValue));
            return;
        }

        if (filter.startsWith("Artist: ")) {
            const artistValue = filter.replace("Artist: ", "");
            setArtistFilter((prev) => prev.filter((item) => item !== artistValue));
            return;
        }

        if (filter.startsWith("Genre: ")) {
            const genreValue = filter.replace("Genre: ", "");
            setGenreFilter((prev) => prev.filter((item) => item !== genreValue));
            return;
        }
    };

    // display for filters that are active
    let activeFiltersDisplay;

    if (activeFilters.length === 0) {
        activeFiltersDisplay = <p className="text-muted mb-0">No active filters.</p>;
    } else {
        activeFiltersDisplay = (
            <div className="active-filters">
                {activeFilters.map((filter, index) => (
                    <button key={index} type="button" className="filter-chip filter-chip-button" onClick={() => removeActiveFilter(filter)}>
                        {filter}
                    </button>
                ))}
            </div>
        );
    }

    useEffect(() => {
        if (!isFiltering) {
            return;
        }

        const timer = window.setTimeout(() => {
            setIsFiltering(false);
        }, 120);

        return () => window.clearTimeout(timer);
    }, [titleFilter, yearFilter, artistFilter, genreFilter, sortBy, isFiltering]);

    return (
        <main>
            <div className="songs-header">
                <h1 className="songs-title">Songs</h1>
                <p className="songs-subtitle">
                    Search by title, year, artist, or genre, then add songs directly to your playlist.
                </p>
            </div>

            <section className="songs-layout mb-4 d-flex flex-column flex-lg-row gap-4">
                <aside className="songs-sidebar flex-shrink-0">
                    {/* Decided to allow to select a playlist in Songs page as well, data is able to be transfered throughout different pages */}
                    {!isLoggedIn && (
                        <p>Log in to create a playlist!</p>
                    )}
                    {isLoggedIn && (
                        <div className="songs-panel p-4 rounded-4 shadow-sm bg-lilac">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <h2 className="mb-1">Choose playlist</h2>
                                    <p className="text-muted mb-0">Select where new songs go.</p>
                                </div>
                            </div>
                            <select
                                className="form-select"
                                value={selectedPlaylist}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedPlaylist(value);
                                    setCurrentPlaylistId(value === "" ? null : Number(value));
                                }}
                            >
                                <option value="">( No playlist selected )</option>
                                {playlists.map((playlist) => (
                                    <option key={playlist.id} value={playlist.id}>
                                        {playlist.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="songs-panel mb-4 p-4 rounded-4 shadow-sm bg-white">
                        <div className="songs-filters">
                            <div className="section-heading mb-3">
                                <h2>Filters</h2>
                            </div>
                            <div className="songs-filter-grid">
                                <div className="songs-filter-row">
                                    <label className="form-label">Title</label>
                                    <input type="text" className="form-control song-filter-input" placeholder="Search title" value={titleFilter} onChange={(e) => { setTitleFilter(e.target.value); setIsFiltering(true); }} />
                                </div>
                                <div className="songs-filter-row">
                                    <label className="form-label">Year</label>
                                    <div className="dropdown-checkbox">
                                        <button type="button" className="btn btn-outline-secondary dropdown-toggle text-start" onClick={() => setYearOpen(!yearOpen)}>
                                            {yearFilter.length > 0 ? `Year (${yearFilter.length})` : 'Select years'}
                                        </button>
                                        {yearOpen && (
                                            <div className="dropdown-menu show">
                                                {yearOptions.map((year) => (
                                                    <label key={year} className="dropdown-item checkbox-item">
                                                        <input
                                                            type="checkbox"
                                                            checked={yearFilter.includes(year)}
                                                            onChange={() => {
                                                                const next = yearFilter.includes(year)
                                                                    ? yearFilter.filter((item) => item !== year)
                                                                    : [...yearFilter, year];
                                                                setYearFilter(next);
                                                                setIsFiltering(true);
                                                            }}
                                                        />
                                                        <span>{year}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="songs-filter-row">
                                    <label className="form-label">Artist</label>
                                    <div className="dropdown-checkbox">
                                        <button type="button" className="btn btn-outline-secondary dropdown-toggle text-start" onClick={() => setArtistOpen(!artistOpen)}>
                                            {artistFilter.length > 0 ? `Artist (${artistFilter.length})` : 'Select artists'}
                                        </button>
                                        {artistOpen && (
                                            <div className="dropdown-menu show">
                                                {artistOptions.map((artist) => (
                                                    <label key={artist} className="dropdown-item checkbox-item">
                                                        <input
                                                            type="checkbox"
                                                            checked={artistFilter.includes(artist)}
                                                            onChange={() => {
                                                                const next = artistFilter.includes(artist)
                                                                    ? artistFilter.filter((item) => item !== artist)
                                                                    : [...artistFilter, artist];
                                                                setArtistFilter(next);
                                                                setIsFiltering(true);
                                                            }}
                                                        />
                                                        <span>{artist}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="songs-filter-row">
                                    <label className="form-label">Genre</label>
                                    <div className="dropdown-checkbox">
                                        <button type="button" className="btn btn-outline-secondary dropdown-toggle text-start" onClick={() => setGenreOpen(!genreOpen)}>
                                            {genreFilter.length > 0 ? `Genre (${genreFilter.length})` : 'Select genres'}
                                        </button>
                                        {genreOpen && (
                                            <div className="dropdown-menu show">
                                                {genreOptions.map((genre) => (
                                                    <label key={genre} className="dropdown-item checkbox-item">
                                                        <input
                                                            type="checkbox"
                                                            checked={genreFilter.includes(genre)}
                                                            onChange={() => {
                                                                const next = genreFilter.includes(genre)
                                                                    ? genreFilter.filter((item) => item !== genre)
                                                                    : [...genreFilter, genre];
                                                                setGenreFilter(next);
                                                                setIsFiltering(true);
                                                            }}
                                                        />
                                                        <span className='genre-text'>{genre}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="songs-main-content flex-fill">
                    <section className="active-filters-panel mb-4 p-4 rounded-4 shadow-sm bg-white d-flex flex-column gap-3">
                        <div className="d-flex align-items-center justify-content-between gap-3">
                            <div>
                                <h2 className="h5 mb-0">Active filters</h2>
                            </div>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => {
                                setTitleFilter("");
                                setYearFilter([]);
                                setArtistFilter([]);
                                setGenreFilter([]);
                            }}>
                                Reset filters
                            </button>
                        </div>
                        {activeFiltersDisplay}
                    </section>

                    <section>
                        <div className="results-header d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-3">
                            <h2 className="mb-0">Results</h2>
                            <div className="results-sort d-flex align-items-center gap-2">
                                <label className="form-label mb-0">Sort by</label>
                                <select className="form-select song-filter-input" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setIsFiltering(true); }}>
                                    <option value="title">Title</option>
                                    <option value="year">Year</option>
                                    <option value="artist">Artist</option>
                                    <option value="genre">Genre</option>
                                </select>
                            </div>
                        </div>
                        {isFiltering ? (
                            <div className="d-flex justify-content-center align-items-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Applying filters...</span>
                                </div>
                            </div>
                        ) : (
                            results
                        )}
                    </section>
                </div>
            </section>
            {/* Shows if user adds a song to a playlist or already has the song in the selected playlist */}
            {showToast && (
                <div className="song-toast-container">
                    <Toast bg={toastVariant} onClose={() => setShowToast(false)} show={showToast} delay={2500} autohide>
                        <Toast.Header>
                            <strong className="me-auto">Playlist</strong>
                        </Toast.Header>
                        <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                    </Toast>
                </div>
            )}
        </main>
    );
}

export default Songs;