import styles from './Header.module.css';
import logo from "../media/Spaider-logo-black-RGB.png";
import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";
import data from "../data/pLoc.json";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from 'react-select';

export default function Header() {
    const { location, putLocation, logout } = useContext(AuthContext);
    console.log(location)

    // Transform locations and sections into options for react-select
    const locationOptions = data.locations.map((loc) => ({
        value: loc,
        label: loc.name,
    }));

    const sectionOptions = location.location
        ? data.sections
            .filter((section) => section.locationID === location.location.id)
            .map((section) => ({
                value: section,
                label: section.id +" : " +section.name,
            }))
        : [];

    const handleLocationChange = (selectedOption) => {
        const selectedLocation = selectedOption.value;
        const defaultSection = data.sections.find(
            (section) => section.locationID === selectedLocation.id
        );

        console.log({
            location: selectedLocation,
            section: defaultSection,
        });

        // Update the location and default section in the context
        putLocation({
            location: selectedLocation,
            section: defaultSection,
        });
    };

    const handleSectionChange = (selectedOption) => {
        const selectedSection = selectedOption.value;

        console.log({
            location: location.location,
            section: selectedSection,
        });

        // Update only the section in the context
        putLocation({
            location: location.location,
            section: selectedSection,
        });
    };

    return (
        <div className={`${styles.Header} desktop`}>
            <img src={logo} alt={"Spaider"} className={`${styles.logo} desktop`} />
            <div className={styles.select}>
                <Select
                    options={locationOptions}
                    value={
                        location.location
                            ? { value: location.location, label: location.location.name }
                            : null
                    }
                    onChange={handleLocationChange}
                    placeholder="Select Location"
                    className={styles.reactSelect}
                />
                <Select
                    options={sectionOptions}
                    value={
                        location.section
                            ? { value: location.section, label: location.section.name }
                            : null
                    }
                    onChange={handleSectionChange}
                    placeholder="Select Section"
                    isDisabled={!location.location} // Disable until a location is selected
                    className={styles.reactSelect}
                />
                <button className={"hoverable"} onClick={logout}>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} /> Logga ut
                </button>
            </div>
        </div>
    );
}
