import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../lib/supabase';
import SongList from './SongList.jsx';

function Songs(props) {

    const [titleFilter, setTitleFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [artistFilter, setArtistFilter] = useState("");
    const [genreFilter, setGenreFilter] = useState("");

    const [sortBy, setSortBy] = useState("title");
    const [songs, setSongs] = useState([]);

    const playlists = props.playlists;
    const setPlaylists = props.setPlaylists;
    const [selectedPlaylist, setSelectedPlaylist] = useState("");
    /*
    // test songs
    const songs = [
        {id: 1, title: "Love Song", artist: "Artist A", year: 2018, genre: "Pop"},
        {id: 2, title: "Sky High", artist: "Artist B", year: 2020, genre: "Pop"},
        {id: 3, title: "Midnight", artist: "Artist C", year: 2016, genre: "Country"}
    ];
    */

    useEffect(() => {
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
        }

        getSongs();
    }, []);

    // filtered songs logic
    const filteredSongs = songs.filter((song) =>
        song.title.toLowerCase().includes(titleFilter.toLowerCase()) && 
        song.year.toString().includes(yearFilter) &&
        song.artist.toLowerCase().includes(artistFilter.toLowerCase()) &&
        song.genre.toLowerCase().includes(genreFilter.toLowerCase())
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
            setPlaylists={setPlaylists}
            selectedPlaylist={selectedPlaylist}
        />
    );

    // active filters
    let activeFilters = [];

    if (titleFilter !== "") {
        activeFilters.push("Title: " + titleFilter);
    }

    if (yearFilter !== "") {
        activeFilters.push("Year: " + yearFilter);
    }

    if (artistFilter !== "") {
        activeFilters.push("Artist: " + artistFilter);
    }

    if (genreFilter !== "") {
        activeFilters.push("Genre: " + genreFilter);
    }

    // display for filters that are active
    let activeFiltersDisplay;

    if (activeFilters.length === 0) {
        activeFiltersDisplay = <p>No active filters.</p>;
    } else {
        activeFiltersDisplay = activeFilters.map((filter, index) => (
            <p key={index}>{filter}</p>
        ));
    }

    return (
        <main>
            <h1>Songs</h1>

            <section>
                <h2>Filters</h2>
                <input type="text" placeholder="Search Title" value={titleFilter} onChange={(e) => setTitleFilter(e.target.value)}/>
                <input type="text" placeholder="Search Year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}/>
                <input type="text" placeholder="Search Artist" value={artistFilter} onChange={(e) => setArtistFilter(e.target.value)}/>
                <input type="text" placeholder="Search Genre" value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}/>

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="title">Title</option>
                    <option value="year">Year</option>
                    <option value="artist">Artist</option>
                </select>

                <button onClick={() => {
                    setTitleFilter("");
                    setYearFilter("");
                    setArtistFilter("");
                    setGenreFilter("");
                }}>Reset Filters</button>
            </section>

            <section>
                <h2>Choose Playlist</h2>

                <select
                    value={selectedPlaylist}
                    onChange={(e) => setSelectedPlaylist(e.target.value)}
                >
                    <option value="">Select a playlist</option>

                    {playlists.map((playlist, index) => (
                        <option key={index} value={index}>
                            {playlist.name}
                        </option>
                    ))}
                </select>
            </section>

            <section>
                <h2>Active Filters</h2>
                {activeFiltersDisplay}
            </section>

            <section>
                <h2>Results</h2>
                {results}
            </section>

        </main>
    );
}

export default Songs;