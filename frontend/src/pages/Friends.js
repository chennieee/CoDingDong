import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFriends } from '../hooks/useFriends';

const Friends = ({ userId }) => {
    const { friends } = useFriends(userId);
    const navigate = useNavigate();

    function navigateToProfile() {
        navigate('/profile');
    }

    return (
        <div className="friends">
            <button onClick={() => navigateToProfile()}>Back to Profile</button>
            <h1>My Friends</h1>
            <ul>
                {friends.map((friend, index) => (
                    <li key={index}>{friend.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default Friends;