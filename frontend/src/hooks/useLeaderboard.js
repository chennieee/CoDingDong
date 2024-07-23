import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext';

export const useLeaderboard = () => {
    const { user } = useAuthContext();
    const userId = user ? user._id : null;

    const [leaderboard, setLeaderboard] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchLeaderboard = useCallback(async () => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        try {
            if (initialLoad) setInitialLoad(true);
            const response = await axios.get(`${apiUrl}/leaderboard/${userId}`);
            console.log(response.data); //debugging
            setLeaderboard(response.data.topUsers);
            setUserRank(response.data.userRank);
            setInitialLoad(false);
        
        } catch (error) {
            setError('Error fetching leaderboard data');
        }
    }, [userId, apiUrl, initialLoad]);

    useEffect(() => {
        fetchLeaderboard();
        const intervalId = setInterval(fetchLeaderboard, 30000); //Poll every 30 seconds
        return () => clearInterval(intervalId); //cleanup on unmount
    }, [fetchLeaderboard]);

    return { leaderboard, userRank, initialLoad, error };
};