import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect } from "react";

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if(!context) {
    throw Error('useAuthContext must be used inside an AuthContextProvider');
  }

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem('user');
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return context;
};