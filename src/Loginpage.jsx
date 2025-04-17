import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

function Loginpage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { setUserInfo } = useContext(UserContext);

    async function login(e) {
        e.preventDefault();

        if (!username || !password) {
            setErrorMessage("Please fill in both fields.");
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                const userInfo = await response.json();
                setUserInfo(userInfo);
                setRedirect(true);
            } else {
                setErrorMessage("Invalid username or password.");
            }
        } catch (error) {
            setErrorMessage("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
}

export default Loginpage;
