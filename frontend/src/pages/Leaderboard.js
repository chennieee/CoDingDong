import React from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import './Leaderboard.css';

const Leaderboard = () => {
    const { leaderboard, userRank, initialLoad, error } = useLeaderboard();

    if (initialLoad) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    console.log('Leaderboard data:', leaderboard);
    console.log('User Rank:', userRank);

    return (
        <div className="leaderboard">
            <h1>Weekly Leaderboard</h1>
            <ul>
                {leaderboard.map((user, index) => (
                    <li key={index}>
                        <span>{index + 1}. {user.username}</span>
                        <span className="xp">+{user.weeklyXP} XP</span>
                    </li>
                ))}
            </ul>
            {userRank && <p>Your Rank: {userRank}</p>}
        </div>
    );
};

export default Leaderboard;