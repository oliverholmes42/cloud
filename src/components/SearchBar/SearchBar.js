import { useState } from 'react';
import styles from './SearchBar.module.css'
import FloatingButton from '../FloatingButton/FloatingButton';

export default function SearchBar({onSearch}) {
    const [search, setSearch] = useState("");

    // Handle input change and update search state
    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearch(e.target.value);
        if(query.length<1){
            onSearch("")
        }
    };

    return (
        <div className={styles.searchContainer}>
            <input
                value={search}
                onChange={handleInputChange} // Handle input change
                className={styles.searchInput}
                placeholder="Sök..."
                onKeyDown={(e)=>{
                    if(e.key==='Enter'){
                        onSearch(search)
                    }
                }}
            />
            <button className={`hoverable ${styles.searchButton}`} onClick={()=>{onSearch(search)}}>Sök</button>
        </div>
    );
}
