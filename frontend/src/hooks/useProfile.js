import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext';

export const useProfile = (userId) => {
    const { user: contextUser } = useAuthContext(); //get current user from context
    const [user, setUser] = useState(contextUser); //initialise with contextUser
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            const userIdToFetch = userId || contextUser?._id;

            if (!userIdToFetch) {
                console.error('User ID is undefined.');
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}/users/profile/${userIdToFetch}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
            console.log('Fetching user data for userId:', userIdToFetch); //debugging - log after userIdToFetch is defined
        };
        
        //Fetch user data if there is a specific userId provided or no context user
        if (userId || !contextUser) {
            fetchUserData();
        }
    }, [userId, contextUser, apiUrl]);

    return { user };
};