import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import styles from './LoginPage.module.css';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import data from '../data/pLoc.json';

export default function LocationPage() {
    const { logout, putLocation } = useContext(AuthContext);

    // Transform locations and sections into options for react-select
    const locationOptions = data.locations.map((loc) => ({
        value: loc,
        label: loc.name,
    }));

    const [formData, setFormData] = useState({
        location: locationOptions[0]?.value || null,
        section: data.sections.find(
            (section) => section.locationID === locationOptions[0]?.value.id
        ) || null,
    });

    const sectionOptions = formData.location
        ? data.sections
            .filter((section) => section.locationID === formData.location.id)
            .map((section) => ({
                value: section,
                label: section.id + " : " + section.name,
            }))
        : [];

    const handleLocationChange = (selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            location: selectedOption?.value || null,
            section: data.sections.find(
                (section) => section.locationID === selectedOption?.value?.id
            ) || null,
        }));
    };

    const handleSectionChange = (selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            section: selectedOption?.value || null,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.location || !formData.section) {
            alert("Please select both a location and a section.");
        } else {
            putLocation({
                location: formData.location,
                section: formData.section,
            });
        }
    };

    return (
        <div className={styles.loginContainer}>
            <h2 className={styles.loginTitle}>Select Location and Section</h2>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div className={styles.inputGroup}>
                    <label htmlFor="location">Location</label>
                    <Select
                        options={locationOptions}
                        value={
                            formData.location
                                ? { value: formData.location, label: formData.location.name }
                                : null
                        }
                        onChange={handleLocationChange}
                        placeholder="Select Location"
                        className={styles.reactSelect}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="section">Section</label>
                    <Select
                        options={sectionOptions}
                        value={
                            formData.section
                                ? { value: formData.section, label: formData.section.name }
                                : null
                        }
                        onChange={handleSectionChange}
                        placeholder="Select Section"
                        isDisabled={!formData.location} // Disable until a location is selected
                        className={styles.reactSelect}
                    />
                </div>

                <button type="submit" className={styles.loginButton}>
                    Confirm Selection
                </button>
            </form>
            <button onClick={logout} className={styles.logoutButton}>
                Logga ut <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>
        </div>
    );
}
