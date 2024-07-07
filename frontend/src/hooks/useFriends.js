import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext';

export const useFriends = (userId) => {
    const { user: contextUser } = useAuthContext();
    const [friends, setFriends] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [friendRequests, setFriendRequests] = useState(contextUser?.friendRequests || []);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchFriends = async () => {
            const userIdToFetch = userId || contextUser?._id;

            if (!userIdToFetch) {
                console.error('User ID is undefined');
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}/friends/${userIdToFetch}`);
                setFriends(response.data.friends);
                setFriendRequests(response.data.friendRequests);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        if (userId || contextUser) {
            fetchFriends();
        }
    }, [userId, contextUser, apiUrl]);


    const searchUsers = async (username) => {
        try {
            const response = await axios.get(`${apiUrl}/friends/search?username=${username}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };


    const sendFriendRequest = async (friendUsername) => {
        try {
            await axios.post(`${apiUrl}/friends/sendRequest`, 
                { userId: contextUser._id, friendUsername }
            );
            alert('Friend request sent');
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };


    const acceptFriendRequest = async (senderId) => {
        try {
            await axios.post(`${apiUrl}/friends/acceptRequest`,
                { userId: contextUser._id, senderId }
            );
            alert('Friend request accepted');

            // Refresh friends and friend requests
            const response = await axios.get(`${apiUrl}/friends/${contextUser._id}`);
            setFriends(response.data.friends);
            setFriendRequests(response.data.friendRequests);

        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };


    const deleteFriendRequest = async (senderId) => {
        try {
            await axios.delete(`${apiUrl}/friends/deleteRequest`, {
                data: { userId: contextUser._id, senderId }
            });
            alert('Friend request deleted');

            // Refresh friend requests
            const response = await axios.get(`${apiUrl}/friends/${contextUser._id}`);
            setFriendRequests(response.data.friendRequests);

        } catch (error) {
            console.error('Error deleting friend request:', error);
        }
    };


    const removeFriend = async (friendId) => {
        try {
            await axios.delete(`${apiUrl}/friends/removeFriend`, {
                data: { userId: contextUser._id, friendId }
            });
            alert('Friend removed');

            // Refresh friends
            const response = await axios.get(`${apiUrl}/friends/${contextUser._id}`);
            setFriends(response.data.friends);
        
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    }

    return { 
        friends, 
        searchResults, 
        friendRequests, 
        searchUsers,
        sendFriendRequest,
        acceptFriendRequest,
        deleteFriendRequest,
        removeFriend
    };
};