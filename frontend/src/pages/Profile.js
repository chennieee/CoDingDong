import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Profile = ({ userId }) => {
    const [user, setUser] = useState({});
    const history = useHistory();

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await axios.get(`/users/${userId}`);
            setUser(response.data);
        };

        fetchUserData();
    }, [userId]);

    return (
        <div className="profile">
            <button onClick={() => history.push('/')}>Home</button>
            <div>
                <button onClick={() => history.push('/friends')}>My Friends</button>
            </div>
            <div>
                <p>Username: {user.username}</p>
                <p>Streak: {user.streak} days</p>
                <p>XP: {user.xp}</p>
                <p>Friends: {user.friends?.length || 0}</p>
            </div>
        </div>
    );
};

export default Profile;
