import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import styles from './LoginPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

export default function LocationPage() {
    const {logout} = useContext(AuthContext);
    const locations = [
        { id: 91356735131, name: 'The Green Tavern' },
        { id: 91356735132, name: 'Pitchers Örebro' }
    ];

    const sections = [
        { id: 61374724, name: 'Main Bar', locationID: 91356735131 },
        { id: 61374725, name: 'Outdoor Patio', locationID: 91356735131 },
        { id: 61374726, name: 'VIP Lounge', locationID: 91356735132 },
        { id: 61374727, name: 'Rooftop Bar', locationID: 91356735132 },
        { id: 61374728, name: 'Private Dining Room', locationID: 91356735132 }
    ];

    const [formData, setFormData] = useState({
        location: locations[1].id, // Set default location to the first one
        section: sections[0].id
    });
    const [error, setError] = useState(false);
    const { putLocation } = useContext(AuthContext); // Get the putLocation function from AuthContext

    // Generic handleChange for all fields
    const handleChange = (e) => {
        setError(false);
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value, // Dynamically update based on the name attribute
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.location || !formData.section) {
            setError(true);
        } else {
            putLocation(formData); // Submit form data with selected location and section
        }
    };

    // Filter sections based on selected location
    const filteredSections = sections.filter(section => section.locationID === parseInt(formData.location));

    return (
        <div className={styles.loginContainer}>
            <h2 className={styles.loginTitle}>Select Location and Section</h2>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div className={styles.inputGroup}>
                    <label htmlFor="location">Location</label>
                    <select
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={styles.inputField}
                    >
                        {locations.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="section">Section</label>
                    <select
                        id="section"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        className={styles.inputField}
                    >
                        <option value="" disabled>Select a section</option>
                        {filteredSections.map((section) => (
                            <option key={section.id} value={section.id}>
                                {section.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className={`hoverable ${styles.loginButton}`}>
                    Välj
                </button>
                

                {error && <p className={styles.error}>Please select both a location and section.</p>}
            </form>
            <button onClick={logout} className={`hoverable ${styles.logoutButton}`}>
                    Logga ut 
                    <FontAwesomeIcon icon={faRightToBracket}/>
                </button>
        </div>
    );
}
