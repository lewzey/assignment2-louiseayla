import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import HeaderApp from './components/HeaderApp.jsx';
import './App.css'

import Home from './components/Home.jsx';
import Artists from './components/Artists.jsx';
import Genres from './components/Genres.jsx';
import Songs from './components/Songs.jsx';

import SingleSong from './components/SingleSong.jsx';
import SingleArtist from './components/SingleArtist.jsx';
import SingleGenre from './components/SingleGenre.jsx';

import Playlists from './components/Playlists.jsx';

function App() {
  const [playlists, setPlaylists] = useState(() => {
    const savedPlaylists = localStorage.getItem('playlists');

    if (savedPlaylists) {
      return JSON.parse(savedPlaylists);
    } else {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

  return (
    <main>
      <HeaderApp />
      <div>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/artists" element={<Artists/>} />
          <Route path="/artist/:id" element={<SingleArtist />} />
          <Route path="/genres" element={<Genres/>} />
          <Route path="/genre/:id" element={<SingleGenre />} />
          <Route path="/songs" element={<Songs playlists={playlists} setPlaylists={setPlaylists} />} />
          <Route path="/song/:id" element={<SingleSong/>}></Route>
          <Route path="/playlists" element={<Playlists playlists={playlists} setPlaylists={setPlaylists} />} />
          <Route path="/about" element={<h1>About</h1>} />
          <Route path="/login" element={<h1>Login</h1>} />
           {/* TO BE IMPLEMENTED
          <Route path="/artists" element={<Artists />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/songs" element={<Browse />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/song/:id" element={<SingleSong />} />
          <Route path="/artist/:id" element={<SingleArtist />} />
          <Route path="/genre/:id" element={<SingleGenre />} />
           */}
        </Routes>
      </div>
    </main>
  );

}


export default App
