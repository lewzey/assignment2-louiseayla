import { Link } from 'react-router-dom';

function SongList(props) {
    const songs = props.songs;
    const playlists = props.playlists;
    const setPlaylists = props.setPlaylists;
    const selectedPlaylist = props.selectedPlaylist;

    if (songs.length === 0) {
        return <p>No songs found.</p>;
    }

    return (
        <div>
            {songs.map((song) => (
                <div key={song.id}>
                    <Link to={`/song/${song.id}`}>{song.title}</Link>
                    <Link to={`/artist/${song.artist_id}`}>{song.artist}</Link>
                    <span>{song.year}</span>
                    <Link to={`/genre/${song.genre_id}`}>{song.genre}</Link>

                    {playlists && setPlaylists ? (
                        <button onClick={() => {
                            if (selectedPlaylist !== "") {
                                const updatedPlaylists = [...playlists];
                                updatedPlaylists[selectedPlaylist].songs.push(song);
                                setPlaylists(updatedPlaylists);
                            }
                        }}>
                            Add to Playlist
                        </button>
                    ) : null}
                </div>
            ))}
        </div>
    );
}

export default SongList;