import styles from './Drawer.module.css';
import { useStack } from "../StackContext";

export default function Drawer({ routes }) {
  const { push } = useStack();
  
  return (
    <div className={styles.drawer}>
      {routes.map((list, listIndex) => (
        <div key={listIndex} className={styles.block}>
          {list.map((item, itemIndex) => (
            <div 
              key={itemIndex} 
              className={styles.hoverable} 
              onClick={() => push(item.page)}
            >
              <h2>{item.title}</h2>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
