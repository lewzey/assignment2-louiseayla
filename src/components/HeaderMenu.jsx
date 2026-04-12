import { Link, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const HeaderMenu = function (props) {
    const location = useLocation();

    const handleClick = () => {
        if (typeof props.setIsLoading === 'function') {
            props.setIsLoading();
        }
    };

    return (
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
        </Navbar>
    );
}

export default HeaderMenu;