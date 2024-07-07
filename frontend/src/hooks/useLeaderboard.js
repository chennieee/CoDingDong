import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext';

export const useLeaderboard = () => {
    const { user } = useAuthContext();
    const userId = user ? user._id : null;

    const [leaderboard, setLeaderboard] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!userId) {
                setLoading(false);
                setError('User not authenticated');
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}/leaderboard/${userId}`);
                setLeaderboard(response.data.topUsers);
                setUserRank(response.data.userRank);
                setLoading(false);
            
            } catch (error) {
                setLoading(false);
                setError('Error fetching leaderboard data');
            }
        };

        fetchLeaderboard();

    }, [userId, apiUrl]);

    return { leaderboard, userRank, loading, error };
};