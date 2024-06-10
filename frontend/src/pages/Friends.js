import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Friends = ({ userId }) => {
    const [friends, setFriends] = useState([]);
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_URL;

    function navigateToProfile() {
        navigate('/profile'); // not sure if this will call user's profile or smth else 
    }

    useEffect(() => {
        const fetchFriends = async () => {
            const response = await axios.get(`${apiUrl}/users/${userId}/friends`);
            setFriends(response.data);
        };

        fetchFriends();
    }, [userId, apiUrl]);

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
