import { useState, useEffect } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Navigate to dashboard only if login is successful
    if (isSuccess) {
      navigate('/dashboard');
    }
  }, [isSuccess, navigate]);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
      });
      const json = await response.json();

      // unsuccessful login
      if (!response.ok) {
        throw new Error(json.error);
      }

      // Log the response for debugging
      console.log('Login response:', json);

      // successful login
      localStorage.setItem('user', JSON.stringify(json)); //save user to localStorage
      dispatch({ type: 'LOGIN', payload: json }); //update AuthContext
      setIsLoading(false);
      setIsSuccess(true);
    
    } catch (error) {
      setIsLoading(false);
      setIsSuccess(error.message);
    }
  };

  return { login, isLoading, error };
};