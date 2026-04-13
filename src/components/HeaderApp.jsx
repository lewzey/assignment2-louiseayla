import { Link, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function HeaderApp({ setIsLoading, currentPlaylist, isLoggedIn, setIsLoggedIn, setCurrentPlaylistId }) {
    const location = useLocation();

    const handleClick = () => {
        if (typeof setIsLoading === 'function') {
            setIsLoading();
        }
    };

    const handleLogout = () => {
        handleClick();
        setIsLoggedIn(false);
        setCurrentPlaylistId(null);
    };

    return (
        <header className="header-app">
            <Navbar expand="lg" className="custom-navbar">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="brand" onClick={handleClick}>
                        Loula
                    </Navbar.Brand>

                    <Nav className="mx-auto other-links">
                        <Nav.Link as={Link} to="/" onClick={handleClick}>Home</Nav.Link>
                        <Nav.Link as={Link} to="/artists" onClick={handleClick}>Artists</Nav.Link>
                        <Nav.Link as={Link} to="/genres" onClick={handleClick}>Genres</Nav.Link>
                        <Nav.Link as={Link} to="/songs" onClick={handleClick}>Songs</Nav.Link>

                        {isLoggedIn && (
                            <Nav.Link as={Link} to="/playlists" onClick={handleClick}>Playlists</Nav.Link>
                        )}

                        <Nav.Link
                            as={Link}
                            to="/about"
                            state={{ backgroundLocation: location }}
                            onClick={handleClick}
                        >
                            About
                        </Nav.Link>

                        <Nav.Item className="playlist-slot">
                            <Nav.Link
                                as={Link}
                                to="/playlists"
                                className={`playlist-text ${currentPlaylist ? "show" : "hide"}`}
                                onClick={handleClick}
                            >
                                {currentPlaylist && (
                                    <>
                                        {currentPlaylist.name}
                                        <span className="playlist-count">
                                            {currentPlaylist.songs?.length || 0}
                                        </span>
                                    </>
                                )}
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Nav>
                        {!isLoggedIn ? (
                            <Nav.Link as={Link} to="/login" onClick={handleClick}>Login</Nav.Link>
                        ) : (
                            <Nav.Link as={Link} to="/" onClick={handleLogout}>Logout</Nav.Link>
                        )}
                    </Nav>
                </Container>
            </Navbar>
        </header>
    );
}

export default HeaderApp;