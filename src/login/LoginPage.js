import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import styles from './LoginPage.module.css';
import { loginToken } from '../api/api';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(false);
    const { login, putToken } = useContext(AuthContext); // Get the login function from AuthContext

    // Generic handleChange for all fields
    const handleChange = (e) => {
        setError(false);
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value, // Dynamically update based on the name attribute
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const { email, password } = formData;

        // Validate the input with hardcoded credentials
        if (email === 'test@user.com' && password === 'testpassword') {
            login(formData); // Call the login function from AuthContext
            loginToken()
    .then((token) => {
        if (token) {
            console.log("Token received:", token);
            putToken(token); // Pass the token if it exists
        } else {
            console.log("Failed to retrieve token.");
        }
    })
    .catch((error) => {
        console.error("Error in login process:", error);
    });
        } else {
            setError(true); // Show error if credentials are wrong
        }
    };

    return (
        <div className={styles.loginContainer}>
            <h2 className={styles.loginTitle}>Login</h2>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Epost</label>
                    <input
                        id="email"
                        name="email" // Add the name attribute
                        type="email"
                        value={formData.email}
                        onChange={handleChange} // Use the generic handleChange
                        className={styles.inputField}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password">Lösenord</label>
                    <input
                        id="password"
                        name="password" // Add the name attribute
                        type="password"
                        value={formData.password}
                        onChange={handleChange} // Use the generic handleChange
                        className={styles.inputField}
           
                    />
                </div>
                <button type="submit" className={styles.loginButton}>
                    Log In
                </button>
                <p className={`${error ? styles.error : styles.fair}`}>Felaktiga uppgifter</p>

            </form>
        </div>
    );
}
