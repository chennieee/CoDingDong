import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';

const Profile = ({ userId }) => {
    const { user } = useProfile(userId);
    const navigate = useNavigate();

    function navigateToDashboard() {
        navigate('/dashboard');
    }

    function navigateToFriends() {
        navigate('/friends');
    }


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