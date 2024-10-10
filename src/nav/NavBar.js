import Settings from "../navPages/SettingsPage";
import styles from "./NavBar.module.css";
import logo from '../media/Spaider-logo-black-RGB.png';
import Dash from "../navPages/DashPage";
import React, { useEffect, useMemo } from 'react';
import ProductPage from "../navPages/ProductPage";
import { useStack } from "../StackContext";

export default function Navbar({ setActive, active }) { // Add activePage prop
    const items = useMemo(() => [
        { title: "Dashboard", page: <Dash /> },
        { title: "Settings", page: <Settings /> },
        {title: "Artiklar", page: <ProductPage/>}
    ], []);

    const {flush} = useStack();

    const navigate = (page) => {
        flush();
        setActive(page);
    }

    useEffect(() => {
        setActive(items[0].page);
    }, [items, setActive]);

    const MenuItem = ({ page }) => {
        // Determine if the current page is active
        const isActive = active === page.page;
        console.log(isActive)

        return (
            <div 
                onClick={()=>navigate(page.page)} 
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
