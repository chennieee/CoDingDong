import { useState, useEffect } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Navigate to dashboard only if signup is successful
    if (isSuccess) {
      navigate('/dashboard');
    }
  }, [isSuccess, navigate]);

  const signup = async (username, password) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await fetch(`${apiUrl}/users/signup`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
      });
      const json = await response.json();

      // unsuccessful signup
      if (!response.ok) {
        throw new Error(json.error);
      }

      // Log the response for debugging
      console.log('Signup response:', json);

      // successful signup
      localStorage.setItem('user', JSON.stringify(json)); //save user to localStorage
      dispatch({ type: 'LOGIN', payload: json }); //update AuthContext
      setIsLoading(false);
      setIsSuccess(true);
    
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  return { signup, isLoading, error, setIsLoading, setError };
};