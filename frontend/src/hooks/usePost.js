import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePost = (postId) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${apiUrl}/posts/post/${postId}`);
                setPost(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId, apiUrl]);

    return { post, loading, error };
};