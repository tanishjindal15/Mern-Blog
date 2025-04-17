import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Editor from "./Editor.jsx";

function Editpost() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(res => res.json())
            .then(postInfo => {
                setTitle(postInfo.title);
                setSummary(postInfo.summary);
                setContent(postInfo.content);
            });
    }, [id]);

    function updatePost(ev) {
        ev.preventDefault();

        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if (files?.[0]) {
            data.set('file', files[0]);
        }

        fetch('http://localhost:4000/post', {
            method: 'PUT',
            body: data,
            credentials: 'include',
        }).then(response => {
            if (response.ok) {
                setMessage("Post updated!");
                setRedirect(true);
            }
        });
    }

    if (redirect) {
        return <Navigate to={`/post/${id}`} />
    }

    return (
        <form onSubmit={updatePost}>
            <input 
                type="text" 
                placeholder="Title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Summary" 
                value={summary} 
                onChange={e => setSummary(e.target.value)} 
            />
            <input 
                type="file" 
                onChange={ev => setFiles(ev.target.files)} 
            />
            <Editor value={content} onChange={setContent} />
            <button style={{ marginTop: '5px' }}>Update Post</button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default Editpost;
