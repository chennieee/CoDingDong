import { useEffect, useState } from 'react';
import axios from 'axios';

export const useFriends = (userId) => {
    const [friends, setFriends] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchFriends = async () => {
            const response = await axios.get(`${apiUrl}/users/${userId}/friends`);
            setFriends(response.data);
        };

        fetchFriends();
        
    }, [userId, apiUrl]);

    return { friends };
};