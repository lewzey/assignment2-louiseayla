import { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';

function Playlists(props) {

    //const [playlists, setPlaylists] = useState([]);
    const playlists = props.playlists;
    const setPlaylists = props.setPlaylists;
    const setIsLoading = props.setIsLoading;
    const [newName, setNewName] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        if (typeof setIsLoading === 'function') {
            setIsLoading(false);
        }
    }, [setIsLoading]);

    // display playlists
    let playlistsDisplay;

    if (playlists.length === 0) {
        playlistsDisplay = <p>No playlists yet.</p>;
    } else {
        playlistsDisplay = playlists.map((p, index) => {

            let songsDisplay;

            if (p.songs.length === 0) {
                songsDisplay = <p className="text-muted mb-0">No songs yet.</p>;
            } else {
                songsDisplay = (
                    <ul className="playlist-songs">
                        {p.songs.map((song, i) => (
                            <li key={i}>
                                <p className="mb-0">{song.title}</p>
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => {
                                    const updatedPlaylists = [...playlists];
                                    updatedPlaylists[index].songs.splice(i, 1);
                                    setPlaylists(updatedPlaylists);
                                    setToastMessage(`Removed "${song.title}" from ${p.name}`);
                                    setShowToast(true);
                                }}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                );
            }

            return (
                <div key={index} className="playlist-card">
                    <div className="playlist-card-header">
                        <div>
                            <h3>{p.name}</h3>
                            <p>{p.songs.length} song{p.songs.length === 1 ? '' : 's'}</p>
                        </div>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => {
                            const updatedPlaylists = [...playlists];
                            updatedPlaylists.splice(index, 1);
                            setPlaylists(updatedPlaylists);
                        }}>
                            Delete playlist
                        </button>
                    </div>
                    {songsDisplay}
                </div>
            );
        });
    }

    return (
        <main>
            <div className="songs-header">
                <h1 className="songs-title">Playlists</h1>
                <p className="songs-subtitle">
                    Create playlists, browse the songs inside, and remove items with ease.
                </p>
            </div>

            <section className="playlists-panel mb-4 p-4 rounded-4 shadow-sm bg-white">
                <div className="create-playlist-row d-flex flex-column flex-md-row align-items-start gap-3">
                    <div className="flex-fill">
                        <h2 className="mb-3">Create Playlist</h2>
                        <div className="d-flex flex-column flex-sm-row gap-3 align-items-stretch">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Playlist name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <button className="btn btn-purple btn-sm" onClick={() => {
                                if (newName !== "") {
                                    setPlaylists([...playlists, { name: newName, songs: [] }]);
                                    setNewName("");
                                }
                            }}>
                                Add playlist
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="playlists-list">
                <h2 className="mb-3">Your Playlists</h2>
                {playlistsDisplay}
            </section>

            {showToast && (
                <div className="song-toast-container">
                    <Toast bg="success" onClose={() => setShowToast(false)} show={showToast} delay={2500} autohide>
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

export default Playlists;