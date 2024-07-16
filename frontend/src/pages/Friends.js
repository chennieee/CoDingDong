import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFriends } from '../hooks/useFriends';
import { useAuthContext } from '../hooks/useAuthContext';
import './Friends.css';

const Friends = () => {
    const { user } = useAuthContext();
    const userId = user ? user._id : null;
    const {
        friends = [],
        searchResults = [],
        receivedFriendRequests = [],
        searchUsers,
        sendFriendRequest,
        acceptFriendRequest,
        deleteFriendRequest,
        removeFriend
    } = useFriends(userId);
    const navigate = useNavigate();

    const handleSearch = (username) => {
        searchUsers(username);
    };

    const handleSendRequest = async (friendUsername) => {
        await sendFriendRequest(friendUsername);
    };

    const handleAcceptRequest = (senderId) => {
        acceptFriendRequest(senderId);
    };

    const handleDeleteRequest = (senderId) => {
        if (window.confirm('Are you sure you want to delete the friend request?')) {
            deleteFriendRequest(senderId);
        }
    };

    const handleRemoveFriend = (friendId) => {
        if (window.confirm('Are you sure you want to remove the friend?')) {
            removeFriend(friendId);
        }
    };

    function navigateToProfile() {
        navigate('/profile');
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="friends">
            <button className="back" onClick={() => navigateToProfile()}>Back to Profile</button>
            <h2>Find Friends</h2>
            <input
                type="text"
                placeholder="Search by username"
                onChange={(e) => handleSearch(e.target.value)}
            />
            <ul className="user-list">
                {searchResults.length > 0 ? (
                    searchResults
                        .filter(result => result.username !== user.username) // filter out the current user
                        .map((result) => (
                            <li key={result.username} className="user-item">
                                {result.username}
                                <button className="addFriend"
                                    onClick={() => handleSendRequest(result.username)}
                                    disabled={result.status === 'requested' || result.status === 'pending'}
                                    style={{ backgroundColor: result.status === 'requested' ? 'green' : result.status === 'pending' ? 'grey' : 'blue' }}
                                >
                                    {result.status === 'requested' ? 'Requested' :
                                        result.status === 'pending' ? 'Pending' : 'Add Friend'}
                                </button>
                            </li>
                        ))
                ) : (
                    <p>No search results</p>
                )}
            </ul>
            <h2>Friend Requests</h2>
            {receivedFriendRequests.length === 0 ? (
                <p>You have no friend requests at the moment</p>
            ) : (
                <ul className="user-list">
                    {receivedFriendRequests.map((request) => (
                        <li key={request._id} className="user-item">
                            <span>{request.username}</span>
                            <div>
                                <button className="accept" onClick={() => handleAcceptRequest(request._id)}>
                                    Accept
                                </button>
                                <button className="delete" onClick={() => handleDeleteRequest(request._id)}>
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <h2>My Friends</h2>
            {friends.length === 0 ? (
                <p>You have no friends at the moment</p>
            ) : (
                <ul className="user-list">
                    {friends.map((friend) => (
                        <li key={friend._id} className="user-item">
                            <span>{friend.username} - XP: {friend.xp}, Streak: {friend.streak}</span>
                            <button className="remove" onClick={() => handleRemoveFriend(friend._id)}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Friends;