import { useEffect } from 'react';
import { Link } from "react-router-dom";
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import ariana from '../assets/ariana.jpg';
import zara from '../assets/zara.jpg';
import yena from '../assets/yena.png';
import fire from '../assets/fire.png';

const Home = (props) => {
    useEffect(() => {
        if (typeof props.setIsLoading === 'function') {
            props.setIsLoading(false);
        }
    }, [props.setIsLoading]);

    return (
        <Carousel>
            <Carousel.Item interval={1000}>
                {/*Image by <a href="https://pixabay.com/users/davidenglund-2685832/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1440961">David Englund</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1440961">Pixabay</a> */}
                <img src={fire} alt="First slide" className="artist-image mb-4 mb-4 border border-dark rounded" />
                <Carousel.Caption>
                    <h3>Welcome to Loula! </h3>
                    <p>Loula is a music playlist builder built by Ayla and Louise that allows users to browse songs, filter them by artist, genre, or year, and create custom playlists.</p>
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
                    <p>
                        Who doesn't love a good K-pop song? Take a peek inside the most popular K-pop songs right now! 
                    </p>
                     <Button as={Link} to="/genre/123" variant="light">K-pop Songs</Button>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={1000}>
                <img src={ariana} alt="Fourth slide" className="artist-image-ari mb-4 mb-4 border border-dark rounded" />
                <Carousel.Caption>
                    <h3>Ariana Grande</h3>
                    <p>
                        One of the legends of pop music, Ariana Grande continues to release hit after hit. Check out what songs she has in store for you!
                    </p>
                    <Button as={Link} to="/artist/11" variant="light">Ariana's Page</Button>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}


export default Home;