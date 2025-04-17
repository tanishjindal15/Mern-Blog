import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";

function Header() {
    const { userInfo, setUserInfo } = useContext(UserContext);

    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        })
        .then(response => response.json())
        .then(userInfo => {
            if (userInfo?.username) {
                setUserInfo(userInfo);  
            }
        })
        .catch(err => console.log("Profile fetch failed:", err));
    }, []);

    function logout() {
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        })
        .then(() => {
            setUserInfo(null);
        })
        .catch(err => console.log("Logout failed:", err));
    }

    return (
        <header>
            <Link to="/" className="logo">MyBlog</Link>
            <nav>
                {userInfo?.username ? (
                    <>
                        <Link to="/create">Create New Post</Link>
                        <a onClick={logout} style={{ cursor: 'pointer' }}>Logout ({userInfo.username})</a>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
