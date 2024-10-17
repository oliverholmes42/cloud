import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State to hold user data
    const [location, setLocation] = useState(null);

    // Load user data from sessionStorage on initial load
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        const storedLocation = sessionStorage.getItem('location');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Set user from sessionStorage
        }
        if (storedLocation){
            setLocation(JSON.parse(storedLocation))
        }
    }, []);

    // Login function to store user data
    const login = (userData) => {
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData)); // Store user in sessionStorage
    };

    const putLocation = (data) => {
        setLocation(data);
        sessionStorage.setItem('location', JSON.stringify(data))
    }

    const removeLocation = () => {
        setLocation(null);
        sessionStorage.removeItem('location');
    }

    // Logout function to clear user data
    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user'); // Remove user from sessionStorage
        removeLocation();
    };


    // Function to get user data
    const getUserData = () => {
        return user;
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, getUserData, putLocation, removeLocation, location}}>
            {children}
        </AuthContext.Provider>
    );
};
