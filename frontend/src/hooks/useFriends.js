import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext';

export const useFriends = (userId) => {
    const { user: contextUser } = useAuthContext();
    const [friends, setFriends] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [receivedFriendRequests, setReceivedFriendRequests] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchFriendsAndRequests = useCallback(async () => {
        const userIdToFetch = userId || contextUser?._id;

        if (!userIdToFetch) {
            console.error('User ID is undefined');
            return;
        }

        try {
            const response = await axios.get(`${apiUrl}/friends/${userIdToFetch}`);
            setFriends(response.data.friends || []);
            setReceivedFriendRequests(response.data.receivedFriendRequests || []);

        } catch (error) {
            console.error('Error fetching friends and friend requests:', error);
        }
    }, [userId, contextUser, apiUrl]);

    useEffect(() => {
        if (userId || contextUser) {
            fetchFriendsAndRequests();
        }
    }, [userId, contextUser, fetchFriendsAndRequests]);


    const searchUsers = async (username) => {
        try {
            const response = await axios.get(`${apiUrl}/friends/search`, {
                params: { username, currentUserId: contextUser._id }
            });
            let results = response.data;

            // Filter out current friends from search results
            results = results.filter(
                result => !friends.some(friend => friend.username === result.username)
            );
            
            // Show request status of search results
            const resultsWithStatus = results.map(result => {
                const isRequested = contextUser.sentFriendRequests && contextUser.sentFriendRequests.includes(result._id);
                const isPending = receivedFriendRequests && receivedFriendRequests.some(
                    request => request._id.toString() === result._id.toString()
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
            console.log(`Sending friend request: userId=${contextUser._id}, friendUsername=${friendUsername}`); // debugging
            const response = await axios.post(`${apiUrl}/friends/sendRequest`, 
                { userId: contextUser._id, friendUsername }
            );

            // Update context user's sentFriendRequests
            contextUser.sentFriendRequests = contextUser.sentFriendRequests || []; //initialise sentFriendRequests
            contextUser.sentFriendRequests.push(response.data.recipientId);

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
            fetchFriendsAndRequests();

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
            fetchFriendsAndRequests();

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
            fetchFriendsAndRequests();
        
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    }

    return { 
        friends, 
        searchResults, 
        receivedFriendRequests,
        searchUsers,
        sendFriendRequest,
        acceptFriendRequest,
        deleteFriendRequest,
        removeFriend
    };
};