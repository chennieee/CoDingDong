import { useState, useEffect } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to home page if user logouts
    if (isLoggedOut) {
      navigate('/');
    }
  }, [isLoggedOut, navigate]);

  const logout = () => {
    setIsLoggedOut(false);

    // Remove user from local storage
    localStorage.removeItem('user');

    // Dispatch logout action
    dispatch({ type: 'LOGOUT' });

    setIsLoggedOut(true);
  };

  return { logout };
};