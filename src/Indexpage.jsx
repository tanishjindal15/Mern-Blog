import { useEffect, useState } from 'react';
import Post from './Post.jsx';

function IndexPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/post')  // Fixed incorrect API URL
            .then(response => response.json())
            .then(posts => setPosts(posts))
            .catch(error => console.error("Error fetching posts:", error)); // Added error handling
    }, []);

    return (
        <>
            {posts.length > 0 ? (
                posts.map(post => <Post key={post._id} {...post} />) // Fixed passing post data
            ) : (
                <p>No posts available.</p>
            )}
        </>
    );
}

export default IndexPage;
