import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import supabase from '../lib/supabase';
import ariana from '../assets/ariana.jpg';
import zara from '../assets/zara.jpg';
import yena from '../assets/yena.png';
import fire from '../assets/fire.png';
import Toast from 'react-bootstrap/Toast';

const Home = (props) => {
    const [songs, setSongs] = useState([]);
    const [query, setQuery] = useState('');
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        if (typeof props.setIsLoading === 'function') {
            props.setIsLoading(false);
        }
    }, [props.setIsLoading]);

    useEffect(() => {
        async function loadSongs() {
            const { data, error } = await supabase
                .from('songs')
                .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name)`)
                .limit(200);

            if (!error && data) {
                const mapped = data.map((s) => ({
                    id: s.song_id,
                    title: s.title,
                    artist: s.artists.artist_name,
                    artist_id: s.artists.artist_id,
                    genre: s.genres?.genre_name,
                }));
                setSongs(mapped);
                setFiltered(mapped.slice(0, 8));
            }
        }

        loadSongs();
    }, []);

    useEffect(() => {
        if (query.trim() === '') {
            setFiltered(songs.slice(0, 8));
            return;
        }

        const q = query.toLowerCase();
        setFiltered(
            songs.filter((s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)).slice(0, 8)
        );
    }, [query, songs]);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');

    function handleAddToPlaylist(song) {
        if (!props.isLoggedIn) {
            setToastVariant('danger');
            setToastMessage('Please log in to add songs to a playlist.');
            setShowToast(true);
            return;
        }

        if (!props.currentPlaylistId) {
            setToastVariant('danger');
            setToastMessage('Select a playlist first.');
            setShowToast(true);
            return;
        }

        let added = false;
        const updated = props.playlists.map((pl) => {
            if (pl.id !== props.currentPlaylistId) return pl;
            if (pl.songs.some((s) => s.id === song.id)) return pl;
            added = true;
            return { ...pl, songs: [...pl.songs, song] };
        });

        if (added) {
            props.setPlaylists(updated);
            setToastVariant('success');
            setToastMessage(`Added "${song.title}" to playlist.`);
            setShowToast(true);
        } else {
            setToastVariant('danger');
            setToastMessage('Song already in playlist.');
            setShowToast(true);
        }
    }

    const featured = (props.playlists && props.playlists.length > 0) ? props.playlists.slice(0, 3) : null;

    return (
        <>
            {/* Full-width carousel at top (restored styling) */}
            <section className="my-0">
                <Carousel>
                    <Carousel.Item interval={1000} className="carousel-hero">
                        <img src={fire} alt="First slide" className="artist-image-zara mb-4 mb-4 border border-dark rounded" />
                        <Carousel.Caption>
                            <h3 className="carousel-title">Welcome to Loula!</h3>
                            <p className="carousel-text">Loula is a music playlist builder built by Ayla and Louise that allows users to browse songs, filter them by artist, genre, or year, and create custom playlists.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item interval={1000}>
                        <img src={zara} alt="Second slide" className="artist-image-zara mb-4 mb-4 border border-dark rounded" />
                        <Carousel.Caption>
                            <h3>Check out this new rising artist!</h3>
                            <p>Zara Larson is making waves in the music industry with her song Midnight Sun!</p>
                            <Button as={Link} to="/artist/168" variant="light">Zara's Page</Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item interval={1000}>
                        <img src={yena} alt="Third slide" className="artist-image mb-4 mb-4 border border-dark rounded" />
                        <Carousel.Caption>
                            <h3>K-pop songs on the rise</h3>
                            <p>Who doesn't love a good K-pop song? Take a peek inside the most popular K-pop songs right now!</p>
                            <Button as={Link} to="/genre/123" variant="light">K-pop Songs</Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item interval={1000}>
                        <img src={ariana} alt="Fourth slide" className="artist-image-ari mb-4 mb-4 border border-dark rounded" />
                        <Carousel.Caption>
                            <h3>Ariana Grande</h3>
                            <p>One of the legends of pop music, Ariana Grande continues to release hit after hit. Check out what songs she has in store for you!</p>
                            <Button as={Link} to="/artist/11" variant="light">Ariana's Page</Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </section>

            <Container>
                {showToast && (
                    <div className="song-toast-container">
                        <Toast bg={toastVariant === 'success' ? 'success' : 'danger'} onClose={() => setShowToast(false)} show={showToast} delay={2500} autohide>
                            <Toast.Header>
                                <strong className="me-auto">Playlist</strong>
                            </Toast.Header>
                            <Toast.Body className={toastVariant === 'success' ? 'text-white' : 'text-white'}>{toastMessage}</Toast.Body>
                        </Toast>
                    </div>
                )}
                {/* Hero CTA */}
                <section className="songs-header mt-4">
                <h1 className="songs-title">Build playlists you love</h1>
                <p className="songs-subtitle">Browse songs, add favourites, and curate mood-based playlists in seconds!</p>
                <div className="text-center mt-3">
                    <Button as={Link} to="/songs" className="btn-lilac btn-lg me-3">Browse Songs</Button>
                    <Button as={Link} to="/playlists" className="btn-purple btn-lg">Create Playlist</Button>
                </div>
            </section>

            {/* Quick search */}
            <section className="my-5">
                <h2 className="mb-3">Quick Search</h2>
                <Form>
                    <Form.Control type="search" placeholder="Search songs or artists" value={query} onChange={(e) => setQuery(e.target.value)} />
                </Form>

                <Row className="mt-3">
                    {filtered.map((s) => (
                        <Col key={s.id} xs={12} sm={6} md={4} lg={3} className="mb-3">
                            <Card>
                                <Card.Body className="text-center">
                                    <Card.Title className="mb-1">{s.title}</Card.Title>
                                    <Card.Subtitle className="text-muted mb-2">{s.artist}</Card.Subtitle>
                                    <div className="d-flex justify-content-center gap-2" >
                                        <Button as={Link} to={`/song/${s.id}`} variant="purple" size="xs" className='btn-lilac'>View</Button>
                                        <Button onClick={() => handleAddToPlaylist(s)} variant="purple" size="sm" className="btn-purple">Add</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>

        </Container>
        </>
    );
}

export default Home;