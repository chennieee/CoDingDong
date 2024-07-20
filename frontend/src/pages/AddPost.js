//AddPost page
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import './AddPost.css';

const AddPost = () => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [error, setError] = useState(null);
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiUrl}/posts/create`,
                { title, text, userId: user._id }
            );
            navigate('/forum');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form className="create-post" onSubmit={handleCreatePost}>
            <h3>Add a New Post</h3>
            <label>Title:</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
            />
            <label>Text:</label>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text"
            />
            <button type="submit">Post</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default AddPost;