import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State to hold user data

    // Load user data from sessionStorage on initial load
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Set user from sessionStorage
        }
    }, []);

    // Login function to store user data
    const login = (userData) => {
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData)); // Store user in sessionStorage
    };

    // Logout function to clear user data
    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user'); // Remove user from sessionStorage
    };

    // Function to get user data
    const getUserData = () => {
        return user;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, getUserData }}>
            {children}
        </AuthContext.Provider>
    );
};
