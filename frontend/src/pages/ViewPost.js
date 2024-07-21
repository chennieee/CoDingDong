//ViewPost page
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePost } from '../hooks/usePost';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

const ViewPost = () => {
    const { id } = useParams();
    const { user } = useAuthContext();
    const { post, loading, error } = usePost(id);
    const [commentText, setCommentText] = useState('');
    const [commentError, setCommentError] = useState(null);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleAddComment = async () => {
        try {
            await axios.post(`${apiUrl}/posts/comment/${id}`,
                { text: commentText, userId: user._id }
            );
            setCommentText('');
        } catch (error) {
            setCommentError(error.message);
        }
    };

    function navigateToForum() {
        navigate('/forum');
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className="view-post">
            <button onClick={() => navigateToForum()}>Back To Forum</button>
            <h3>{post.title}</h3>
            <p>{post.text}</p>
            <p>Posted by: {post.user ? post.user.username : 'Unknown'}</p>
            <h4>Comments</h4>
            <ul>
                {post.comments.map((comment, index) => (
                    <li key={index}>
                        <strong>{comment.user ? comment.user.username : 'Unknown'}:</strong> {comment.text}
                    </li>
                ))}
            </ul>
            <div className="add-comment">
                <input 
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment"
                />
                <button onClick={handleAddComment}>Post</button>
                {commentError && <div className="error">{commentError}</div>}
            </div>
        </div>
    );
};

export default ViewPost;