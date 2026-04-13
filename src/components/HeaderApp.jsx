import { Link, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const HeaderApp = ({ setIsLoading, currentPlaylist }) => {
    const location = useLocation();

    const handleClick = () => {
        if (typeof setIsLoading === 'function') {
            setIsLoading();
        }
    };

    return (
        <header className="header-app">
            <Navbar expand="lg" className="custom-navbar">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="brand" onClick={handleClick}>
                        Loula
                    </Navbar.Brand>

                    <Nav className="mx-auto">
                        <Nav.Link as={Link} to="/" onClick={handleClick}>Home</Nav.Link>
                        <Nav.Link as={Link} to="/artists" onClick={handleClick}>Artists</Nav.Link>
                        <Nav.Link as={Link} to="/genres" onClick={handleClick}>Genres</Nav.Link>
                        <Nav.Link as={Link} to="/songs" onClick={handleClick}>Songs</Nav.Link>
                        <Nav.Link as={Link} to="/playlists" onClick={handleClick}>Playlists</Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/about"
                            state={{ backgroundLocation: location }}
                            onClick={handleClick}
                        >
                            About
                        </Nav.Link>
                    </Nav>

                    <Nav>
                        <Nav.Link as={Link} to="/login" onClick={handleClick}>Login</Nav.Link>
                    </Nav>
                </Container>

                <div className="current-playlist-bar">
                    Current Playlist: {currentPlaylist ? `${currentPlaylist.name} (${currentPlaylist.songs?.length || 0})` : 'None selected'}
                </div>
            </Navbar>
        </header>
    );
};

export default HeaderApp;