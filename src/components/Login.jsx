import { useState } from 'react';
import { useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

//not proper functioning, placeholder for proper authentication
function Login({ show = false, onClose = () => {}, setIsLoggedIn, setIsLoading, onLoginSuccess = () => {} }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (typeof setIsLoading === 'function') setIsLoading();
    }, [setIsLoading]);

    const validEmail = 'email@email.com';
    const validPassword = 'password.123';

    function handleSubmit(e) {
        e.preventDefault();

        if (email === validEmail && password === validPassword) {
            if (typeof setIsLoggedIn === 'function') setIsLoggedIn(true);
            setError('');
            // notify parent of successful login so it can show a toast
            if (typeof onLoginSuccess === 'function') onLoginSuccess();
            onClose();
        } else {
            setError('Invalid email or password');
        }
    }

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <form id="login-form" onSubmit={handleSubmit}>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            className="form-control"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            className="form-control"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-danger">{error}</p>}

                    {/* Temporary Solution to login, will only work if this login is inputed */}
                    <p className="mt-2 small">Demo login credentials:</p>
                    <p className="small">email@email.com / password.123</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button className="btn btn-purple" onClick={onClose}>
                        Close
                    </Button>
                    <Button type="submit" form="login-form" className="btn btn-purple">
                        Login
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

export default Login;