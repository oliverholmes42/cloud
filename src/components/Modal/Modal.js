
import styles from "./Modal.module.css";

export default function Modal({ children, closeModal }) {


    return (
        <div className={styles.overlay} onClick={closeModal}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <span className={styles.closeButton} onClick={closeModal}>✕</span>
                {children}
            </div>
        </div>
    );
}
