import { useState, useEffect } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to dashboard only if signup is successful
    if (!isLoading && !error) {
      navigate('/dashboard');
    }
  }, [isLoading, error, navigate]);

  const signup = async (username, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('http://localhost:5000/api/users/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password })
    });
    const json = await response.json();
    console.log("test"); //print statement for debugging

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json));

      // update the auth context
      dispatch({ type: 'LOGIN', payload: json });

      // update loading state
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
}