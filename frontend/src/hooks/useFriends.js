import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext';

export const useFriends = (userId) => {
    const { user: contextUser } = useAuthContext();
    const [friends, setFriends] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
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
            let results = response.data;

            // Filter out current friends from search results
            results = results.filter(
                result => !friends.some(friend => friend.username === result.username)
            );
            
            // Show request status of search results
            const resultsWithStatus = results.map(result => {
                const isRequested = friendRequests.some(
                    request => request.sender.toString() === contextUser._id && request.recipient.toString() === result._id
                );
                const isPending = friendRequests.some(
                    request => request.sender.toString() === result._id && request.recipient.toString() === contextUser._id
                );

                return {
                    ...result,
                    status: isRequested ? 'requested' : isPending ? 'pending' : 'add'
                };
            });

            setSearchResults(resultsWithStatus);
            console.log('Search results with status:', resultsWithStatus); //debugging

        } catch (error) {
            console.error('Error searching users:', error);
        }
    };


    const sendFriendRequest = async (friendUsername) => {
        try {
            await axios.post(`${apiUrl}/friends/sendRequest`, 
                { userId: contextUser._id, friendUsername }
            );

            // Update search results to show that a request has been sent
            setSearchResults((prevResults) =>
                prevResults.map(user =>
                    user.username === friendUsername ? { ...user, status: 'requested' } : user
                )
            );
            console.log('Friend request sent to:', friendUsername); //debugging
            alert('Friend request sent');

        } catch (error) {
            if (error.response && error.response.data) {
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
        searchUsers,
        sendFriendRequest,
        acceptFriendRequest,
        deleteFriendRequest,
        removeFriend
    };
};