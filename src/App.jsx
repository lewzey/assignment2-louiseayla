import { useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import HeaderApp from './components/HeaderApp.jsx';
import Footer from './components/Footer.jsx';
import './App.css'

import Home from './components/Home.jsx';
import Artists from './components/Artists.jsx';
import Genres from './components/Genres.jsx';
import Songs from './components/Songs.jsx';

import SingleSong from './components/SingleSong.jsx';
import SingleArtist from './components/SingleArtist.jsx';
import SingleGenre from './components/SingleGenre.jsx';

import Playlists from './components/Playlists.jsx';
import Login from './components/Login.jsx';

import louiseImg from './assets/louise.jpg';
import aylaImg from './assets/ayla.png';

function AboutModal({ onClose }) {
  return (
    <Modal show onHide={onClose} centered size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>About</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="about-modal-section">
          <h5 className='text-center'>About the project</h5>
          <p>
            Loula is a music playlist builder built by Ayla and Louise that allows users to browse songs, filter them by artist, genre, or year, and create custom playlists.
          </p>
          <p>
            The website is designed to be user-friendly, with a clean interface and intuitive navigation.
          </p>
          <p>
            The application was built using React and Vite for the frontend, with Bootstrap used for styling and responsive design.
            The backend is powered by Supabase, which utilizes a PostgreSQL database for data storage.
          </p>
          <div className="text-center">
            <a href="https://github.com/lewzey/assignment2-louiseayla" target="_blank">
              View the project on GitHub!
            </a>
          </div>

        </div>
        <div className="about-modal-section mt-3">
          <h5 className='text-center'>About Ayla</h5>
          <div className="about-modal-section mt-3 d-flex align-items-center gap-3">
            <img src={aylaImg} alt="Louise" className="about-image" />
            <p> Ayla is currently in her fourth year of Computer Science at Mount Royal University. Through this project, 
              she has enjoyed building her web development skills and team collaboration.
            </p>
          </div>
        </div>
        <div className="about-modal-section mt-3">
          <h5 className='text-center'>About Louise</h5>
          <div className="about-modal-section mt-3 d-flex align-items-center gap-3">
            <img src={louiseImg} alt="Louise" className="about-image" />
            <p>Louise is currently finishing up his fourth year in Computer Science at Mount Royal Univerity and is very excited to
              explore the vast world of web development post grad!
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.backgroundLocation;

  const [playlists, setPlaylists] = useState(() => {
    const savedPlaylists = localStorage.getItem('playlists');

    if (savedPlaylists) {
      return JSON.parse(savedPlaylists);
    } else {
      return [];
    }
  });

  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);

  const currentPlaylist = playlists.find(
    (playlist) => playlist.id === currentPlaylistId
  );

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadingTimeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      setCurrentPlaylistId(null);
    }
  }, [isLoggedIn]);

  const showLoading = () => {
    setIsLoading(true);
    if (loadingTimeoutRef.current) {
      window.clearTimeout(loadingTimeoutRef.current);
    }
    loadingTimeoutRef.current = window.setTimeout(() => {
      setIsLoading(false);
      loadingTimeoutRef.current = null;
    }, 1200);
  };

  const hideLoading = () => {
    setIsLoading(false);
    if (loadingTimeoutRef.current) {
      window.clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  };

  const closeAbout = () => {
    if (backgroundLocation) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <main>
      <HeaderApp
        setIsLoading={showLoading}
        currentPlaylist={currentPlaylist}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setCurrentPlaylistId={setCurrentPlaylistId}
      />
      {isLoading && (
        <div className="loading-overlay">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      <div>
        <Routes location={backgroundLocation || location}>
          <Route path="/" element={<Home setIsLoading={hideLoading} />} />
          <Route path="/artists" element={<Artists setIsLoading={hideLoading} />} />
          <Route path="/artist/:id" element={<SingleArtist />} />
          <Route path="/genres" element={<Genres setIsLoading={hideLoading} />} />
          <Route path="/genre/:id" element={<SingleGenre />} />
          <Route
            path="/songs"
            element={
              <Songs
                playlists={playlists}
                setPlaylists={setPlaylists}
                currentPlaylistId={currentPlaylistId}
                setCurrentPlaylistId={setCurrentPlaylistId}
                setIsLoading={hideLoading}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
              path="/song/:id"
              element={
                  <SingleSong
                      playlists={playlists}
                      setPlaylists={setPlaylists}
                      currentPlaylistId={currentPlaylistId}
                  />
              }
          />
          <Route
            path="/playlists"
            element={
              <Playlists
                playlists={playlists}
                setPlaylists={setPlaylists}
                currentPlaylistId={currentPlaylistId}
                setCurrentPlaylistId={setCurrentPlaylistId}
                setIsLoading={hideLoading}
              />
            }
          />
          <Route path="/about" element={<AboutModal onClose={closeAbout} />} />
          <Route
            path="/login"
            element={
              <Login
                setIsLoggedIn={setIsLoggedIn}
                setIsLoading={hideLoading}
              />
            }
          />
        </Routes>
      </div>
      {backgroundLocation && location.pathname === '/about' && <AboutModal onClose={closeAbout} />}
      <Footer />
    </main>
  );

}

export default App