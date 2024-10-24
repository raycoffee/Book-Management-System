import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/users/isAuthenticated`,
          {
            withCredentials: true,
          }
        );

  
        if (response.data.isAuthenticated) {
          setIsLoggedIn(true);
          setUser(response.data.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        
        console.log("Error checking auth", error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkAuthStatus();
  }, []);

  const logOut = async () => {
    try {
      await axios.post(
        `${API_URL}/api/v1/users/logout`,
        {},
        { withCredentials: true }
      );

      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {}
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, logOut, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;