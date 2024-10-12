import Settings from "../navPages/SettingsPage";
import styles from "./NavBar.module.css";
import logo from '../media/Spaider-logo-black-RGB.png';
import Dash from "../navPages/DashPage";
import React, { useEffect, useMemo } from 'react';
import ProductPage from "../navPages/ProductPage";
import { useStack } from "../StackContext";
import InvoicePage from "../navPages/InvoicePage";
import IntegrationPage from "../navPages/IntegrationPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxesStacked, faFileLines, faGaugeHigh, faGears, faPlug } from "@fortawesome/free-solid-svg-icons";

export default function Navbar({ setActive, active }) { // Add activePage prop
    const items = useMemo(() => [
        { title: "Dashboard", page: <Dash />, icon: faGaugeHigh },
        { title: "Artiklar", page: <ProductPage/>, icon: faBoxesStacked },
        { title: "Faktura", page: <InvoicePage />, icon: faFileLines },
        { title: "Intigration", page: <IntegrationPage />, icon: faPlug },
        { title: "Inställningar", page: <Settings />, icon: faGears }
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

        return (
            <div 
                onClick={()=>navigate(page.page)} 
                className={`${styles.MenuItem} ${isActive ? styles.active : ''}`}>
                <FontAwesomeIcon icon={page.icon} size="sm"/>
                <p>{page.title}</p>
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
