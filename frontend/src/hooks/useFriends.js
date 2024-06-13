import { useEffect, useState } from 'react';
import axios from 'axios';

export const useFriends = (userId) => {
    const [friends, setFriends] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`${apiUrl}/users/friends/${userId}`);
                setFriends(response.data);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
        
    }, [userId, apiUrl]);

    return { friends };
};