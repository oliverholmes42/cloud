import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Select from "react-select/base";
import DropDown from "../components/dropdown/DropDown";
import { getNestedValue } from "../components/ItemTable/ItemTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faGear,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

// Helper function to set nested values in an object
const setNestedValue = (obj, key, value) => {
  const keys = Array.isArray(key) ? key : key.split(".");
  keys.reduce((acc, part, index) => {
    if (index === keys.length - 1) {
      acc[part] = value;
    } else {
      if (!acc[part]) acc[part] = {};
      return acc[part];
    }
  }, obj);
};

// EditTableRow Component
export default function EditTableRow({
  item,
  fields,
  onSave,
  onDelete,
  onEdit,
}) {
  const [formData, setFormData] = useState(item);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.select();
    }
  }, [ref]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleInputChange = (e, field) => {
    let value = e.target.value;

    if (field.type === "number") {
      value = parseFloat(value) || 0;
    }

    if (field.type === "select") {
      value = e.target.value;
    }

    if(field.format.language === "SWE"){
      value = e.target.value.fromswe()
    }

    const updatedFormData = { ...formData };
    setNestedValue(updatedFormData, field.key, value);
    setFormData(updatedFormData);
  };

  const handleMultiChange = (name, value) => {
    const updatedFormData = { ...formData };
    setNestedValue(updatedFormData, name, value);
    setFormData(updatedFormData);
  };

  const save = () => {
    toast.success("Item saved");
    onSave(formData);
  };

  const remove = () => {
    toast.success("Item deleted");
    onDelete(item.id);
  };

  const renderInput = (field, value, index) => {
    
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        save();
      }
    };

    switch (field.type) {
      case "text":
        
        const val = field.format.language === "SWE" ? value.toString().toswe() : value;
        return (
          <input
            type="text"
            value={val || ""}
            onChange={(e) => handleInputChange(e, field)}
            ref={index === 0 ? ref : null}
            onKeyDown={handleKeyDown}
            placeholder={field.placeholder || ""}
          />
        );

      case "number":
        const parseNumber = (value) => {
          const decimals = field.format?.decimals || 0; // Use optional chaining to safely access decimals
          if (typeof value === "string") {
            const strippedValue = value.replace(/^0+/, "") || "0";
            const integerPart = strippedValue.slice(0, -decimals) || "0"; // Integer part
            const decimalPart = strippedValue
              .slice(-decimals)
              .padStart(decimals, "0"); // Decimal part
            return parseFloat(`${integerPart}.${decimalPart}`);
          } else if (typeof value === "number") {
            return value / Math.pow(10, decimals); // Convert to decimal
          }
          return NaN; // Invalid value
        };

        const formatNumber = (value) => {
          const decimals = field.format?.decimals || 0; // Use optional chaining to safely access decimals
          if (isNaN(value)) return "";
          return value.toFixed(decimals);
        };

        const formattedValue = formatNumber(parseNumber(value));

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              value={formattedValue || ""}
              onChange={(e) => {
                let rawValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                if (rawValue === "") rawValue = "0"; // Handle empty input as "0"

                const decimals = field.format?.decimals || 0; // Safely access decimals
                rawValue = rawValue.padStart(decimals + 1, "0"); // Pad raw value for decimals

                handleInputChange({ target: { value: rawValue } }, field); // Update form data
              }}
              ref={index === 0 ? ref : null}
              onKeyDown={handleKeyDown}
              style={{ flex: 1 }}
            />
            {field.format?.suffix && (
              <span style={{ marginLeft: "5px" }}>{field.format.suffix}</span>
            )}
          </div>
        );

      case "date":
        const formattedDate =
          typeof value === "string" && value.length === 6
            ? `20${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4, 6)}`
            : value;

        return (
          <input
            type="date"
            value={formattedDate || ""}
            onChange={(e) => handleInputChange(e, field)}
            ref={index === 0 ? ref : null}
            onKeyDown={handleKeyDown}
          />
        );

      case "select":
        const multiple = field.format && field.format.multiple;

        if (multiple) {
          return (
            <DropDown
              options={field.options}
              onChange={(value) => handleMultiChange(field.key, value)}
              value={value || []}
              name={field.key}
              onSave={save}
            />
          );
        } else {
          return (
            <select
              value={value || ""}
              onChange={(e) => handleInputChange(e, field)}
              onKeyDown={handleKeyDown}
            >
              {field.options.map((option, idx) => (
                <option key={idx} value={option.id || option.value}>
                  {option.name || option.title || option}
                </option>
              ))}
            </select>
          );
        }

      case "percentage":
        const rawPercentage =
          typeof value === "number" ? (value * 100).toFixed(2) : value;

        return (
          <input
            type="number"
            value={rawPercentage || ""}
            onChange={(e) => handleInputChange(e, field)}
            ref={index === 0 ? ref : null}
            onKeyDown={handleKeyDown}
            step={0.01}
            placeholder="Enter percentage"
          />
        );

      case "substring":
        if (field.format.substring && value) {
          const [start, end] = field.format.substring;
          const substringValue = value.toString().substring(start, end);
          return (
            <input
              type="text"
              value={substringValue || ""}
              onChange={(e) => handleInputChange(e, field)}
              ref={index === 0 ? ref : null}
              onKeyDown={handleKeyDown}
            />
          );
        }
        return null;

      case "read":
        return <span>{value}</span>;

      default:
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => handleInputChange(e, field)}
            ref={index === 0 ? ref : null}
            onKeyDown={handleKeyDown}
          />
        );
    }
  };

  return (
    <tr>
      {fields.map(
        (field, index) =>
          !field.advanced && (
            <td key={index}>
              {renderInput(field, getNestedValue(formData, field.key), index)}
            </td>
          )
      )}
      <td style={{ textAlign: "right", paddingRight: "20px" }}>
        <button
          className="hoverable"
          onClick={onEdit}
          style={{ marginRight: "20px" }}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
        <button
          className="hoverable"
          onClick={onEdit}
          style={{ marginRight: "20px" }}
        >
          <FontAwesomeIcon icon={faCopy} />
        </button>
        <button className="hoverable delete" onClick={remove}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
}
