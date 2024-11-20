import { useState, useEffect, useRef } from "react";
import { useStack } from "../../StackContext";
import DropDown from '../../components/dropdown/DropDown';
import toast from "react-hot-toast";
import styles from './ItemForm.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { getNestedValue } from "../../components/ItemTable/ItemTable";

// Helper function to set nested values in an object
const setNestedValue = (obj, key, value) => {
    const keys = Array.isArray(key) ? key : key.split('.');
    keys.reduce((acc, part, index) => {
        if (index === keys.length - 1) {
            acc[part] = value;
        } else {
            if (!acc[part]) acc[part] = {};
            return acc[part];
        }
    }, obj);
};

export default function ItemForm({ fields, initialData = {}, onSubmit, isEditMode = false, onDelete }) {
    const { pop } = useStack();
    const [formData, setFormData] = useState(initialData);
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.focus();
        }
    }, [ref]);

    useEffect(() => {
        console.log("Updated formData:", formData);
    }, [formData]);

    const handleInputChange = (e, field) => {
        let value = e.target.value;

        if (field.type === 'number') {
            const parseNumber = (value) => {
                const decimals = field.format?.decimals || 0; // Default to 0 decimals
                if (typeof value === 'string') {
                    const strippedValue = value.replace(/^0+/, '') || '0';
                    const integerPart = strippedValue.slice(0, -decimals) || '0'; // Integer part
                    const decimalPart = strippedValue.slice(-decimals).padStart(decimals, '0'); // Decimal part
                    return parseFloat(`${integerPart}.${decimalPart}`);
                } else if (typeof value === 'number') {
                    return value / Math.pow(10, decimals); // Convert to decimal
                }
                return NaN; // Invalid value
            };

            value = parseNumber(value) || 0; // Format the number correctly
        }

        const updatedFormData = { ...formData };
        setNestedValue(updatedFormData, field.key, value);
        setFormData(updatedFormData);
    };

    const handleMultiChange = (key, value) => {
        const updatedFormData = { ...formData };
        setNestedValue(updatedFormData, key, value);
        setFormData(updatedFormData);
    };

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

    const [expandedSection, setExpandedSection] = useState(null);
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
                    {basicFields.map((field) => (
                        field.type !== "read" && (
                            <div key={field.key} className={styles.FormGroup}>
                                <label className="label">{field.title}</label>
                                {field.type === "text" && (
                                    <input
                                        type="text"
                                        value={getNestedValue(formData, field.key) || ""}
                                        onChange={(e) => handleInputChange(e, field)}
                                        ref={ref}
                                    />
                                )}
                                {field.type === "number" && (
  <div style={{ display: "flex", alignItems: "center" }}>
    <input
      type="text"
      value={
        !isNaN(Number(getNestedValue(formData, field.key))) // Check if the value is a number
          ? Number(getNestedValue(formData, field.key)).toFixed(field.format?.decimals || 0) // Format the number
          : "" // Default to an empty string if the value is not a number
      }
      onChange={(e) => handleInputChange(e, field)}
    />
    {field.format?.suffix && (
      <span style={{ marginLeft: "5px" }}>{field.format.suffix}</span>
    )}
  </div>
)}

                                {field.type === "select" && !field.format?.multiple && (
                                    <select
                                        value={getNestedValue(formData, field.key) || ""}
                                        onChange={(e) => handleInputChange(e, field)}
                                    >
                                        {field.options.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option === true ? "Yes" : option === false ? "No" : option}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {field.type === "select" && field.format?.multiple && (
                                    <DropDown
                                        options={field.options}
                                        value={getNestedValue(formData, field.key) || []}
                                        name={field.key}
                                        onChange={(value) => handleMultiChange(field.key, value)}
                                    />
                                )}
                            </div>
                        )
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
                                {advancedSections[sectionName].map((field) => (
                                    field.type !== "read" && (
                                        <div key={field.key} className={styles.FormGroup}>
                                            <label className="label">{field.title}</label>
                                            {field.type === "text" && (
                                                <input
                                                    type="text"
                                                    value={getNestedValue(formData, field.key) || ""}
                                                    onChange={(e) => handleInputChange(e, field)}
                                                />
                                            )}
                                            {field.type === "number" && (
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <input
                                                        type="text"
                                                        value={getNestedValue(formData, field.key)?.toFixed(field.format?.decimals || 0) || ""}
                                                        onChange={(e) => handleInputChange(e, field)}
                                                    />
                                                    {field.format?.suffix && (
                                                        <span style={{ marginLeft: "5px" }}>{field.format.suffix}</span>
                                                    )}
                                                </div>
                                            )}
                                            {field.type === "select" && !field.format?.multiple && (
                                                <select
                                                    value={getNestedValue(formData, field.key) || ""}
                                                    onChange={(e) => handleInputChange(e, field)}
                                                >
                                                    {field.options.map((option, index) => (
                                                        <option key={index} value={option}>
                                                            {option === true ? "Yes" : option === false ? "No" : option}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                            {field.type === "select" && field.format?.multiple && (
                                                <DropDown
                                                    options={field.options}
                                                    value={getNestedValue(formData, field.key) || []}
                                                    name={field.key}
                                                    onChange={(value) => handleMultiChange(field.key, value)}
                                                />
                                            )}
                                        </div>
                                    )
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
