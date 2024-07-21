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
                //fetch post
                const postResponse = await axios.get(`${apiUrl}/posts/post/${postId}`);
                const post = postResponse.data;

                //fetch user details for post author
                const authorResponse = await axios.get(`${apiUrl}/users/profile/${post.userId}`);
                const author = authorResponse.data;

                //fetch user details for post comments
                const commentsWithUserDetails = await Promise.all(post.comments.map(async (comment) => {
                    const commentUserResponse = await axios.get(`${apiUrl}/users/profile/${comment.userId}`);
                    const commentUser = commentUserResponse.data;
                    return {
                        ...comment,
                        user: { _id: commentUser._id, username: commentUser.username }
                    };
                }));

                setPost({
                    ...post,
                    user: { _id: author._id, username: author.username },
                    comments: commentsWithUserDetails
                });

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchPost();
    }, [post, postId, apiUrl]);

    return { post, loading, error };
};