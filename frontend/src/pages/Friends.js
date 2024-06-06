import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Friends = ({ userId }) => {
    const [friends, setFriends] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchFriends = async () => {
            const response = await axios.get(`/users/${userId}/friends`);
            setFriends(response.data);
        };

        fetchFriends();
    }, [userId]);

    return (
        <div className="friends">
            <button onClick={() => history.push('/profile')}>Back to Profile</button>
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
