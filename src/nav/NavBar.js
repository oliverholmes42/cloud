import Settings from "../navPages/SettingsPage";
import styles from "./NavBar.module.css";
import logo from '../media/Spaider-logo-black-RGB.png';
import Dash from "../navPages/DashPage";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from "../AuthContext";
import ProductPage from "../navPages/ProductPage";
import { useStack } from "../StackContext";
import InvoicePage from "../navPages/InvoicePage";
import IntegrationPage from "../navPages/IntegrationPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBoxesStacked, faCashRegister, faChartSimple, faChevronLeft, faFileLines, faGaugeHigh, faGears, faPlug, faRightFromBracket, faUserTie, faX } from "@fortawesome/free-solid-svg-icons";
import PlaceholderPage from "../stackPages/PlaceholderPage";
import HardWarePage from "../navPages/HardWarePage";
import AdminPage from "../navPages/AdminPage";
import ReportsPage from "../navPages/ReportsPage";

export const routes = [
    [
        { title: "Översikt", page: <Dash />, icon: faGaugeHigh },

    ],
    [
        { title: "Artiklar", page: <ProductPage/>, icon: faBoxesStacked },
        { title: "Fakturor", page: <InvoicePage />, icon: faFileLines },
        {title: "Hårdvara", page: <HardWarePage/>, icon: faCashRegister}

    ],
    [
        {title: "Rapporter", page: <ReportsPage/>, icon: faChartSimple}
    ],
    [
        {title: "Administration", page: <AdminPage/>, icon: faUserTie },
        { title: "Integration", page: <IntegrationPage />, icon: faPlug }
    ],
    [{ title: "Inställningar", page: <Settings />, icon: faGears }]
]

export default function Navbar({ setActive, active }) { // Add activePage prop
    const [expanded, setExpanded] = useState(false);

    const items = routes;

    const {flush, stack} = useStack();

    const navigate = (page) => {
        setExpanded(false);
        flush();
        setActive(page);
    }

    const {logout, removeLocation, location} = useContext(AuthContext);


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

    const renderNav = () => {
        return(
            <>
                <div style={{height: "50px"}} className={'desktop'}>
                </div>
            {items.map((section, sectionIndex) => (
                <div key={sectionIndex} className={styles.Section}>
                    {section.map((item, index) => (
                        <MenuItem page={item} key={index} />
                    ))}
                </div>
            ))}
            </>
        )
    }

    return (<>
        <div className={`${styles.Navbar} desktop`}>
            {renderNav()}
        </div>
        <div className={`mobile ${styles.MobileThings}`}>
            {expanded?
                <div className={`${styles.MobileNav}`}>
                    <FontAwesomeIcon icon={faX} size="2xl" onClick={() => {
                        setExpanded(false)
                    }} className={styles.NavBarIcon}/>
                    {renderNav()}
                    <button className={`hoverable ${styles.Logout}`} onClick={removeLocation}><FontAwesomeIcon
                        icon={faChevronLeft}/> {location.location.name + " " + location.section.name} </button>

                </div> :
                stack.length === 0 && <FontAwesomeIcon icon={faBars} size="2xl" onClick={() => {
                    setExpanded(true)
                }} className={styles.NavBarIcon}/>}

        </div>
        </>
    );
}
