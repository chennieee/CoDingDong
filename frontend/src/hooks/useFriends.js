import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext';

export const useFriends = (userId) => {
    const { user: contextUser } = useAuthContext();
    const [friends, setFriends] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [requestStatus, setRequestStatus] = useState({});
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchFriendsAndRequests = async () => {
            const userIdToFetch = userId || contextUser?._id;

            if (!userIdToFetch) {
                console.error('User ID is undefined');
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}/friends/${userIdToFetch}`);
                setFriends(response.data.friends);
                setFriendRequests(response.data.friendRequests);

                // Update the request status based on the fetched friend requests
                const status = {};
                response.data.friendRequests.forEach(request => {
                    status[request.sender.username] = 'requested';
                });
                setRequestStatus(status);
                console.log('Fetched request status:', status); //debugging

            } catch (error) {
                console.error('Error fetching friends and friend requests:', error);
            }
        };

        if (userId || contextUser) {
            fetchFriendsAndRequests();
        }
    }, [userId, contextUser, apiUrl]);


    const searchUsers = async (username) => {
        try {
            const response = await axios.get(`${apiUrl}/friends/search?username=${username}&currentUserId=${contextUser._id}`);
            setSearchResults(response.data);
            console.log('Search results with status:', response.data); //debugging

        } catch (error) {
            console.error('Error searching users:', error);
        }
    };


    const sendFriendRequest = async (friendUsername) => {
        try {
            await axios.post(`${apiUrl}/friends/sendRequest`, 
                { userId: contextUser._id, friendUsername }
            );

            // Update request status to reflect that a request has been sent
            setRequestStatus(prev => ({ ...prev, [friendUsername]: 'requested' }));

            // Update search results to show that a request has been sent
            setSearchResults((prevResults) =>
                prevResults.map(user =>
                    user.username === friendUsername ? { ...user, requested: true } : user
                )
            );
            console.log('Friend request sent to:', friendUsername); //debugging
            alert('Friend request sent');

        } catch (error) {
            if (error.response && error.response.data) {
                setRequestStatus(prev => ({ ...prev, [friendUsername]: 'error' }));
                alert(error.response.data.error);
            } else {
                console.error('Error sending friend request:', error);
            }
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
        requestStatus, 
        searchUsers,
        sendFriendRequest,
        acceptFriendRequest,
        deleteFriendRequest,
        removeFriend
    };
};