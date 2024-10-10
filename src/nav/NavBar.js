import Settings from "../Pages/Settings";
import styles from "./NavBar.module.css";
import logo from '../media/Spaider-logo-black-RGB.png';
import Dash from "../Pages/Dash";
import React, { useEffect, useMemo } from 'react';

export default function Navbar({ setActive, active }) { // Add activePage prop
    const items = useMemo(() => [
        { title: "Dashboard", page: <Dash /> },
        { title: "Settings", page: <Settings /> }
    ], []);

    useEffect(() => {
        setActive(items[0].page);
    }, [items, setActive]);

    const MenuItem = ({ page }) => {
        // Determine if the current page is active
        const isActive = active === page.page;
        console.log(isActive)

        return (
            <div 
                onClick={() => setActive(page.page)} 
                className={`${styles.MenuItem} ${isActive ? styles.active : ''}`}>
                <h3>{page.title}</h3>
            </div>
        );
    };

    return (
        <div className={styles.Navbar}>
            <img src={logo} alt={"Spaider"} className={styles.logo} />
            {items.map((item, index) => {
                return (
                    <MenuItem page={item} key={index} />
                );
            })}
        </div>
    );
}
