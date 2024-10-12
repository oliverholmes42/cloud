import React from 'react';
import styles from './Drawer.module.css';
import { useStack } from "../StackContext";

export default function Drawer({ routes }) {
  const { push } = useStack();
  
  return (
    <nav className={styles.drawer}>
      {routes.map((list, listIndex) => (
        <div key={listIndex} className={styles.block}>
          {list.map((item, itemIndex) => {
            // Check if 'page' property exists to determine item type
            const isGroupTitle = !item.page;

            if (isGroupTitle) {
              // Render Group Title
              return (
                <div 
                  key={itemIndex} 
                >
                  <h5>{item.title}</h5>
                </div>
              );
            } else {
              // Render Navigational Item
              return (
                <div 
                  key={itemIndex} 
                  className={`hoverable ${styles.item}`} 
                  onClick={() => push(item)}
                >
                  <h3>{item.title}</h3>
                </div>
              );
            }
          })}
        </div>
      ))}
    </nav>
  );
}
