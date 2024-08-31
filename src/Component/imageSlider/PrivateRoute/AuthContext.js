// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        token: null,
      });
    
  const reset = () => {
    const token = localStorage.getItem('jwt_token');

    if (token) {
      // You may want to validate the token here
      // For simplicity, let's assume it's valid for now
      setAuthState({ isLoggedIn: true, token });
    } else {
      setAuthState({ isLoggedIn: false, token: null });
    }
  };


 
  return (
    <AuthContext.Provider value={{ ...authState, reset }}>
    {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};