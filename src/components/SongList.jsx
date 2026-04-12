import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';

function SongList(props) {
    const songs = props.songs;
    const playlists = props.playlists;
    const selectedPlaylist = props.selectedPlaylist;
    const onAddSong = props.onAddSong;

    if (songs.length === 0) {
        return <p>No songs found.</p>;
    }

    return (
        <ListGroup variant="flush">
            {songs.map((song) => (
                <ListGroup.Item key={song.id} className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1 me-3">
                        <Link to={`/song/${song.id}`} className="list-item-title d-block text-decoration-none mb-1">
                            {song.title}
                        </Link>
                        <div className="small text-muted">
                            <Link to={`/artist/${song.artist_id}`} className="text-decoration-none">
                                {song.artist}
                            </Link>
                            {' · '}
                            {song.year}
                            {' · '}
                            <Link to={`/genre/${song.genre_id}`} className="text-decoration-none genre-text">
                                {song.genre}
                            </Link>
                        </div>
                    </div>
                    {playlists && onAddSong ? (
                        <button
                            type="button"
                            className="btn btn-sm btn-purple align-self-start"
                            onClick={() => {
                                if (selectedPlaylist !== "") {
                                    onAddSong(song);
                                }
                            }}
                        >
                            Add
                        </button>
                    ) : null}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}

export default SongList;