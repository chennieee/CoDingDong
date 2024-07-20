import React from 'react';
import { useForum } from '../hooks/useForum';
import { useNavigate } from 'react-router-dom';

const Forum = () => {
    const { posts, loading, error } = useForum();
    const navigate = useNavigate();

    const handleAddPost = () => {
        navigate('/forum/add');
    };

    const handleViewPost = (id) => {
        navigate(`/forum/${id}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="forum">
            <div className="forum-header">
                <input
                    type="text"
                    placeholder="Search"
                    className="search-input"
                />
                <button onClick={handleAddPost}>Add Post</button>
            </div>
            <div className="posts">
                {posts.map(post => (
                    <div key={post._id} className="post" onClick={() => handleViewPost(post._id)}>
                        <h3>{post.title}</h3>
                        <p>{post.text}</p>
                        <p>Comments: {post.comments.length}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Forum;