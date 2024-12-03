// formUtils.js

import React, { useRef } from "react";
import toast from "react-hot-toast";

export const setNestedValue = (obj, key, value) => {
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

export const getNestedValue = (obj, key) => {
    const keys = Array.isArray(key) ? key : key.split('.');
    return keys.reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
};

export const handleInputChange = (e, field, formData, setFormData) => {
    let value = e.target.value;

    if (field.format?.type === "currency") {
        value = Number(value).fromCurrency();
    } else if (field.format?.type === "number") {
        value = value.fromNumber();
    } else if (field.type === "select" && field.format?.type === "single") {
        value = e.target.value; // Use the selected option's id
    } else if (field.type === "text" && field.format?.substring) {
        const originalValue = getNestedValue(formData, field.key) || ""; // Original full string
        const { substring } = field.format; // Get start and end indices
        const before = originalValue.substring(0, substring[0]); // Part before the substring
        const after = originalValue.substring(substring[1]); // Part after the substring

        // Replace the substring portion
        value = `${before}${value.padEnd(substring[1] - substring[0], " ")}`.substring(0, substring[1]);
        value += after;
    } else if (field.type === "text") {
        value = value.toswe();
    }

    const updatedFormData = { ...formData };
    setNestedValue(updatedFormData, field.key, value);
    setFormData(updatedFormData);
};


export const renderInput = (field, formData, setFormData, ref = null) => {
    const value = getNestedValue(formData, field.key) || "";

    if (field.type === "select" && field.format?.type === "single") {
        return (
            <select
                key={field.key}
                value={value}
                onChange={(e) => handleInputChange(e, field, formData, setFormData)}
            >
                {field.format.options.map((option, index) => (
                    <option key={index} value={option.id}>
                        {option.id +" - "+option.name.toswe()}
                    </option>
                ))}
            </select>
        );
    }

    if (field.format?.type === "currency") {
        return (
            <input
                type="text"
                value={value.toCurrency(0)}
                onChange={(e) => handleInputChange(e, field, formData, setFormData)}
                ref={ref}
            />
        );
    }

    if (field.type === "number") {
        return (
            <input
                type="text"
                value={value.toNumber().toString()}
                onChange={(e) => handleInputChange(e, field, formData, setFormData)}
                ref={ref}
            />
        );
    }

    if (field.type === "read"){
       return renderValue(field, value)
    }

    if (field.type === "text" && field.format?.substring){
        const sub = field.format.substring
        return(
            <input
            type="text"
            value={value.toString().substring(sub[0], sub[1]).trim()}
            onChange={(e) => handleInputChange(e, field, formData, setFormData)}
            ref={ref}
            />

        )
    }

    return (
        <input
            type="text"
            value={value.toswe()}
            onChange={(e) => handleInputChange(e, field, formData, setFormData)}
            ref={ref}
        />
    );
};

export const handleSave = (toastMessage, formData, onSave, callback) => {
    toast.success(toastMessage);
    onSave(formData);
    if (callback) callback();
};

export const renderValue = (field, value) => {
    if (!field || value === undefined || value === null) return "";

    const { format } = field;

    if (field.type === "number") {
        if (format?.type === "currency") {
            return `${format?.prefix || ""}${value.toCurrency()}${format?.suffix || ""}`;
        }
        const decimals = format?.decimals ?? 2;
        return `${format?.prefix || ""}${parseFloat(value).toFixed(decimals)}${format?.suffix || ""}`;
    }



    if (format?.type === "percentage") {
        return `${value.toCurrency(format.decimals || 0)}%`;
    }

    if (format?.type === "date" && typeof value === "string" && value.length === 6) {
        const year = `20${value.slice(0, 2)}`;
        const month = value.slice(2, 4);
        const day = value.slice(4, 6);
        return `${year}-${month}-${day}`;
    }

    if (field.type === "select") {
        if (Array.isArray(value)) {
            // Handle multiple selection
            const selectedOptions = value
                .map((id) => field.format.options.find((option) => option.id === id)?.name)
                .filter(Boolean); // Remove undefined values
            if (selectedOptions.length > 0) {
                return selectedOptions.length === 1
                    ? selectedOptions[0]
                    : `${selectedOptions[0]} +${selectedOptions.length - 1}`;
            }
            return "Inga"; // Default for empty arrays
        }

        // Handle single selection
        const option = field.format.options.find((option) => option.id === value);
        return option ? `${option.id} - ${option.name.toswe()}` : "Unknown";
    }

    if (format?.substring && typeof value === "string") {
        const { substring } = format;
        return value.substring(substring[0], substring[1]);
    }

    return value.toString().toswe();
};


export const renderLabel = (field) => {
    return field.title ? field.title.toUpperCase() : field.key.replace(/_/g, ' ').toUpperCase();
};
