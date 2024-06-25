// AuthContext.ts
import React, { createContext, useState, useContext } from 'react';

// Create a context for the auth data
export const AuthContext = createContext({
  authData: {
    accessToken: null,
    refreshToken: null,
    userId: null
  },
  setAuthInfo: () => { },
  clearAuthInfo: () => { }
});

// Create a hook to use the auth context
export const useAuthContext = () => useContext(AuthContext);

export const useAuthStateHandler = () => {
  const [authData, setAuthData] = useState({
    accessToken: null,
    refreshToken: null,
    userId: null
  });

  // Function to update the auth data
  const setAuthInfo = ({ accessToken, refreshToken, userId }) => {
    setAuthData({ accessToken, refreshToken, userId });
  };

  // Function to clear the auth data
  const clearAuthInfo = () => {
    setAuthData({ accessToken: null, refreshToken: null, userId: null });
  };

  return {
    authData,
    setAuthInfo,
    clearAuthInfo
  };
}
