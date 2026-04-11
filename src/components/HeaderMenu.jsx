import { Link } from 'react-router-dom';
const HeaderMenu = function (props) {
    return (
        <nav>
            <Link to="/" className="btn btn1">Home</Link>
            <Link to="/artists" className="btn btn2">Artists</Link>
            <Link to="/genres" className="btn btn3">Genres</Link>
            <Link to="/songs" className="btn btn3">Songs</Link>
            <Link to="/playlists" className="btn btn3">Playlists</Link>
            <Link to="/about" className="btn btn3">About</Link>
            <Link to="/login" className="btn btn3">Login</Link> 
        </nav>
    );
}
export default HeaderMenu;