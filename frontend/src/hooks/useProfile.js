import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext';

export const useProfile = (userId) => {
    const { user: contextUser } = useAuthContext(); //get current user from context
    const [user, setUser] = useState(contextUser); //initialise with contextUser
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        //if there is userId provided or no contextUser, fetchUserData
        if (userId || !contextUser) {
            const fetchUserData = async () => {
                const userIdToFetch = userId || contextUser?._id;

                if (!userIdToFetch) {
                    console.error('User ID is undefined.');
                    return;
                }

                try {
                    const response = await axios.get(`${apiUrl}/users/profile/${userId}`);
                    setUser(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchUserData();
        }
    }, [userId, contextUser, apiUrl]);

    return { user };
};