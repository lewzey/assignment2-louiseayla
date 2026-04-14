import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
const Footer = function () {
    return (
        <Navbar className="custom-navbar footer-navbar mt-5">
            <Container className="flex-column text-center py-3">

                <h6 className="text-white mb-2">
                    <i className="bi bi-music-note-beamed me-2"></i>
                    Loula Music
                </h6>

                <Nav className="gap-4 justify-content-center mb-2">

                    <Nav.Link href="https://github.com/lewzey" target="_blank">
                        <i className="bi bi-github me-1"></i>
                        Louise
                    </Nav.Link>

                    <Nav.Link href="https://github.com/avent464" target="_blank">
                        <i className="bi bi-github me-1"></i>
                        Ayla
                    </Nav.Link>

                </Nav>

                <p className="text-white small mb-0">
                    <i className="bi bi-c-circle me-1"></i>
                    {new Date().getFullYear()} Loula • Built with React & Supabase
                </p>

            </Container>
        </Navbar>
    );
};
export default Footer;
