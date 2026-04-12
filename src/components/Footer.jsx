import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Footer = function () {
    return (
        <Navbar expand="lg" className="custom-navbar footer-navbar">
            <Container className="justify-content-center">
                <Nav className="gap-3">
                    <Nav.Link href="https://github.com/lewzey" target="_blank" rel="noreferrer">
                        Louise's Github
                    </Nav.Link>
                    <Nav.Link href="https://github.com/avent464" target="_blank" rel="noreferrer">
                        Ayla's Github
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Footer;
