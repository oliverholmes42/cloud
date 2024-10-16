import { useState } from 'react';
import styles from './SearchBar.module.css'
import FloatingButton from '../FloatingButton/FloatingButton';

export default function SearchBar() {
    const [search, setSearch] = useState("");

    // Handle input change and update search state
    const handleInputChange = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div className={styles.searchContainer}>
            <input
                value={search}
                onChange={handleInputChange} // Handle input change
                className={styles.searchInput}
                placeholder="Sök..."
            />
            <button className={`hoverable ${styles.searchButton}`}>Sök</button>
        </div>
    );
}
