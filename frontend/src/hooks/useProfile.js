import { useEffect, useState } from 'react';
import axios from 'axios';

export const useProfile = (userId) => {
    const [user, setUser] = useState({});
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/users/profile/${userId}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();

    }, [userId, apiUrl]);

    return { user };
};