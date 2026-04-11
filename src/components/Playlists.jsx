import { useState } from 'react';

function Playlists(props) {

    //const [playlists, setPlaylists] = useState([]);
    const playlists = props.playlists;
    const setPlaylists = props.setPlaylists;
    const [newName, setNewName] = useState("");

    // display playlists
    let playlistsDisplay;

    if (playlists.length === 0) {
        playlistsDisplay = <p>No playlists yet.</p>;
    } else {
        playlistsDisplay = playlists.map((p, index) => {

            let songsDisplay;

            if (p.songs.length === 0) {
                songsDisplay = <p>No songs yet.</p>;
            } else {
                songsDisplay = p.songs.map((song, i) => (
                    <p key={i}>
                        {song.title}

                        <button onClick={() => {
                            const updatedPlaylists = [...playlists];

                            updatedPlaylists[index].songs.splice(i, 1); // remove the song

                            setPlaylists(updatedPlaylists);
                        }}>
                            Remove
                        </button>
                    </p>
                ));
            }

            return (
                <div key={index}>
                    <h3>{p.name} - {p.songs.length} songs</h3>
                    <button onClick={() => {
                        const updatedPlaylists = [...playlists];
                        updatedPlaylists.splice(index, 1);
                        setPlaylists(updatedPlaylists);
                    }}>Delete Playlist</button>

                    {songsDisplay}
                </div>
            );
})};

    return (
        <main>
            <h1>Playlists</h1>

            <section>
                <h2>Create Playlist</h2>
                <input 
                    type="text"
                    placeholder="Playlist name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button onClick={() => {
                    if (newName !== "") {
                        setPlaylists([...playlists, { name: newName, songs: [] }]);
                        setNewName("");
                    }
                }}>
                    Add
                </button>
            </section>

            <section>
                <h2>Your Playlists</h2>
                {playlistsDisplay}
            </section>

        </main>
    );
}

export default Playlists;