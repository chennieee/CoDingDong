import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useAuthContext } from '../hooks/useAuthContext';
import './Profile.css';

const Profile = ({ userId }) => {
    const { user: contextUser } = useAuthContext(); //get user from context
    const { user: profileUser } = useProfile(userId || contextUser?._id); //use profile hook to fetch data
    const navigate = useNavigate();

    function navigateToDashboard() {
        navigate('/dashboard');
    }

    function navigateToFriends() {
        navigate('/friends');
    }

    //decide which user data to use
    //**should we display weekly xp below xp?
    const user = userId ? profileUser : contextUser;
    if (!user) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className="profile">
            <div className="profile-buttons">
                <button onClick={() => navigateToDashboard()}>Home</button>
                <button onClick={() => navigateToFriends()}>My Friends</button>
            </div>
            <div>
                <p>Streak: {user.streak || 0} days</p>
                <p>XP: {user.xp || 0}</p>
                <p>+{user.weeklyXP || 0} XP this week</p>
                <p>Friends: {user.friends?.length || 0}</p>
            </div>
        </div>
    );
};

export default Profile;