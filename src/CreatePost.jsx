import { useState } from "react";
import { Navigate } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [message, setMessage] = useState(''); // Fixed undefined 'message'

    const modules = {
        toolbar: [
            [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            ['link', 'image'],
            [{ 'align': [] }],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'list', 'bold', 'italic', 'underline', 
        'strike', 'blockquote', 'link', 'image', 'align'
    ];

    async function createNewPost(ev) {
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);

        if (files && files.length > 0) {
            data.set('file', files[0]); 
        }

        try {
            const response = await fetch('http://localhost:4000/post', {
                method: 'POST',
                body: data,
                credentials: 'include', 
            });

            if (response.ok) {
                setRedirect(true);
            } else {
                setMessage("Failed to create post");
            }
        } catch (error) {
            setMessage("Error creating post");
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <form onSubmit={createNewPost}>
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
            <ReactQuill 
                value={content} 
                onChange={newValue => setContent(newValue)} 
                modules={modules} 
                formats={formats} 
            />
            <button style={{ marginTop: '5px' }}>Create Post</button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default CreatePost;
