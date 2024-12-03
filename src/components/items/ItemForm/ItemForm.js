import { useState, useEffect, useRef } from "react";
import { useStack } from "../../../StackContext";
import DropDown from '../../dropdown/DropDown';
import toast from "react-hot-toast";
import styles from './ItemForm.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { renderInput, handleInputChange, setNestedValue, getNestedValue } from "../ItemUtil";

export default function ItemForm({ fields, initialData = {}, onSubmit, isEditMode = false, onDelete }) {
    const { pop } = useStack();
    const [formData, setFormData] = useState(initialData);
    const ref = useRef(null);
    const [expandedSection, setExpandedSection] = useState(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.focus();
        }
    }, [ref]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = isEditMode ? "Ändringarna sparades" : "Artikel tillagd";
        toast.success(message);
        onSubmit(formData);
        pop();
    };

    const handleDelete = () => {
        if (onDelete && isEditMode) {
            toast.success("Artikel borttagen");
            onDelete(initialData.id);
            pop();
        }
    };

    const toggleSection = (sectionName) => {
        setExpandedSection((prev) => (prev === sectionName ? null : sectionName));
    };

    const basicFields = fields.filter((field) => !field.advanced);
    const advancedSections = fields
        .filter((field) => field.advanced)
        .reduce((sections, field) => {
            if (!sections[field.advanced]) {
                sections[field.advanced] = [];
            }
            sections[field.advanced].push(field);
            return sections;
        }, {});

    return (
        <form onSubmit={handleSubmit} className={styles.ItemForm}>
            <div className="block">
                <h2 className="header">Basic Information</h2>
                <div className={styles.block}>
                    {basicFields.map((field, index) => (
                        <div key={`${field.key}-${index}`} className={styles.FormGroup}>
                            <label className="label">{field.title}</label>
                            {renderInput(field, formData, setFormData, index === 0 ? ref : null)}
                        </div>
                    ))}
                </div>
            </div>

            {Object.keys(advancedSections).length > 0 && (
                <div className={styles.advancedSectionsContainer}>
                    {Object.keys(advancedSections).map((sectionName) => (
                        <div key={sectionName} className={`block`}>
                            <div className={`hoverable icon ${styles.advancedSectionHeaderContainer}`}>
                                <h3
                                    onClick={() => toggleSection(sectionName)}
                                    className={styles.advancedSectionHeader}
                                >
                                    {sectionName} {expandedSection === sectionName ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
                                </h3>
                            </div>
                            <div className={expandedSection === sectionName ? styles.block : styles.hidden}>
                                {advancedSections[sectionName].map((field, index) => (
                                    <div key={`${field.key}-${index}`} className={styles.FormGroup}>
                                        <label className="label">{field.title}</label>
                                        {renderInput(field, formData, setFormData)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.buttonContainer}>
                <button type="submit" className="hoverable" style={{ marginRight: "10px" }}>
                    {isEditMode ? "Spara" : "Skapa"}
                </button>
                {isEditMode && (
                    <button type="button" className="hoverable delete" onClick={handleDelete}>
                        Radera
                    </button>
                )}
            </div>
        </form>
    );
}
