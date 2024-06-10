import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = ({ userId }) => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_URL;

    function navigateToDashboard() {
        navigate('/dashboard');
    }

    function navigateToFriends() {
        navigate('/friends');
    }

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await axios.get(`${apiUrl}/users/${userId}`);
            setUser(response.data);
        };

        fetchUserData();
    }, [userId, apiUrl]);

    return (
        <div className="profile">
            <button onClick={() => navigateToDashboard()}>Home</button>
            <div>
                <button onClick={() => navigateToFriends()}>My Friends</button>
            </div>
            <div>
                <p>Streak: {user.streak || 0} days</p>
                <p>XP: {user.xp || 0}</p>
                <p>Friends: {user.friends?.length || 0}</p>
            </div>
        </div>
    );
};

export default Profile;
