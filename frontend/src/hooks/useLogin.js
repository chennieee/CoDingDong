import { useState, useEffect } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  
  const apiUrl = process.env.REACT_APP_API_URL;

  // Navigate to dashboard only if login is successful
  useEffect(() => {
    if (!isLoading && error === null && localStorage.getItem('user')) {
      navigate('/dashboard');
    }
  }, [isLoading, error, navigate]);

  // Debugging log -- Display error
  useEffect(() => {
    if (error) {
      console.log('Login error:', error); // Debug log
    }
  }, [error]);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

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
      localStorage.setItem('user', JSON.stringify(json)); //save user to local storage
      dispatch({ type: 'LOGIN', payload: json }); //update AuthContext
      setIsLoading(false);
      navigate('/dashboard');
    
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  return { login, isLoading, error, setIsLoading, setError };
};