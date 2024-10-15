import Settings from "../navPages/SettingsPage";
import styles from "./NavBar.module.css";
import logo from '../media/Spaider-logo-black-RGB.png';
import Dash from "../navPages/DashPage";
import React, { useContext, useEffect, useMemo } from 'react';
import { AuthContext } from "../AuthContext";
import ProductPage from "../navPages/ProductPage";
import { useStack } from "../StackContext";
import InvoicePage from "../navPages/InvoicePage";
import IntegrationPage from "../navPages/IntegrationPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxesStacked, faCashRegister, faFileLines, faGaugeHigh, faGears, faPlug, faRightFromBracket, faUserTie } from "@fortawesome/free-solid-svg-icons";
import PlaceholderPage from "../stackPages/PlaceholderPage";
import HardWarePage from "../navPages/HardWarePage";

export default function Navbar({ setActive, active }) { // Add activePage prop
    // Define the items as a 2D list
    const items = useMemo(() => [
        [
            { title: "Översikt", page: <Dash />, icon: faGaugeHigh },
            
        ],
        [
            { title: "Artiklar", page: <ProductPage/>, icon: faBoxesStacked },
            { title: "Fakturor", page: <InvoicePage />, icon: faFileLines },
            {title: "Hårdvara", page: <HardWarePage/>, icon: faCashRegister}
            
        ],
        [
            {title: "Administration", page: <PlaceholderPage/>, icon: faUserTie },
            { title: "Integration", page: <IntegrationPage />, icon: faPlug }
        ],
        [{ title: "Inställningar", page: <Settings />, icon: faGears }]
    ], []);

    
    

    const {flush} = useStack();

    const navigate = (page) => {
        flush();
        setActive(page);
    }

    const {logout} = useContext(AuthContext);

    useEffect(() => {
        setActive(items[0][0].page); // Set first item from first section as default
    }, [items, setActive]);

    const MenuItem = ({ page }) => {
        // Determine if the current page is active
        const isActive = active === page.page;

        return (
            <div 
                onClick={() => navigate(page.page)} 
                className={`${styles.MenuItem} ${isActive ? styles.active : ''}`}>
                <FontAwesomeIcon icon={page.icon} className={styles.icon} />
                <p>{page.title}</p>
            </div>
        );
    };

    return (
        <div className={styles.Navbar}>
            <img src={logo} alt={"Spaider"} className={styles.logo} />
            {items.map((section, sectionIndex) => (
                <div key={sectionIndex} className={styles.Section}>
                    {section.map((item, index) => (
                        <MenuItem page={item} key={index} />
                    ))}
                </div>
            ))}
            <button className={`hoverable ${styles.Logout}`} onClick={logout}>Logga ut <FontAwesomeIcon icon={faRightFromBracket} /> </button>
        </div>
    );
}
