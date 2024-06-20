//AuthContext checks if users are successfully logged in
import { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Loaded user from local storage:', user); // Debug log

    if (user && user._id) {
      dispatch({ type: 'LOGIN', payload: user }); 
    }
  }, []);

  console.log('AuthContext state:', state); //debugging
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  );
};