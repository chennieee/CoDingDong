import { useEffect, useState } from 'react';
import axios from 'axios';

export const useProfile = (userId) => {
    const [user, setUser] = useState({});
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await axios.get(`${apiUrl}/users/${userId}`);
            setUser(response.data);
        };

        fetchUserData();

    }, [userId, apiUrl]);

    return { user };
};