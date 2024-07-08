import React, { createContext, useState, useContext } from 'react';

// Define the shape of the auth data
interface AuthData {
  accessToken: string | null;
  userId: string | null;
  username: string | null;
}

// Define the context value type
interface AuthContextType {
  authData: AuthData;
  setAuthInfo: (data: AuthData) => void;
  clearAuthInfo: () => void;
}

// Create a context for the auth data
export const AuthContext = createContext<AuthContextType>({
  authData: {
    accessToken: null,
    userId: null,
    username: null
  },
  setAuthInfo: () => {},
  clearAuthInfo: () => {}
});

// Create a hook to use the auth context
export const useAuthContext = () => useContext(AuthContext);

// Define the return type for useAuthStateHandler
export const useAuthStateHandler = (): AuthContextType => {
  const [authData, setAuthData] = useState<AuthData>({
    accessToken: null,
    userId: null,
    username: null    
  });

  // Function to update the auth data
  const setAuthInfo = ({ accessToken, userId, username }: AuthData) => {
    setAuthData({ accessToken, userId, username });
    localStorage.setItem('accessToken', accessToken);
  };

  // Function to clear the auth data
  const clearAuthInfo = () => {
    setAuthData({ accessToken: null, userId: null, username: null });
  };

  return {
    authData,
    setAuthInfo,
    clearAuthInfo
  };
};
