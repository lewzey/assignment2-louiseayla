import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn, setIsLoading }) {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setIsLoading();
    }, [setIsLoading]);

    const validEmail = 'email@email.com';
    const validPassword = 'password.123';

    function handleSubmit(e) {
        e.preventDefault();

        if (email === validEmail && password === validPassword) {
            setIsLoggedIn(true);
            setError('');
            navigate('/');
        } else {
            setError('Invalid email or password');
        }
    }

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label>Password</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit">Login</button>
            </form>

            <p>Demo login credentials:</p>
            <p>email@email.com / password.123</p>
        </div>
    );
}

export default Login;