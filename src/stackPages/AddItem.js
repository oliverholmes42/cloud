import { useState } from "react";
import { useStack } from "../StackContext";
import DropDown from '../components/dropdown/DropDown'

export default function AddItem({ fields, onCreate }) {
  const { pop } = useStack();

  // Initialize state for form data
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      if (field.type === "select" && field.format?.multiple) {
        acc[field.key] = []; // Default value for multi-select dropdown is an empty array
      } else if (field.type === "select") {
        acc[field.key] = field.options[0]; // Default value for single-select
      } else {
        acc[field.key] = ""; // Default value for other types
      }
      return acc;
    }, {})
  );

  // Handle input changes
  const handleInputChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add any additional validation if needed
    onCreate(formData); // Pass the new item data to the parent or backend
    pop(); // Close the modal or go back to the previous state
    // Reset form after submission
    setFormData(
      fields.reduce((acc, field) => {
        if (field.type === "select" && field.format?.multiple) {
          acc[field.key] = []; // Reset multi-select dropdown
        } else if (field.type === "select") {
          acc[field.key] = field.options[0]; // Reset single-select
        } else {
          acc[field.key] = ""; // Reset other types
        }
        return acc;
      }, {})
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        field.type !== "read" && (
          <div key={field.key}>
            <label>{field.title}</label>

            {/* Render input fields based on the field type */}
            {field.type === "text" && (
              <input
                type="text"
                value={formData[field.key]}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                value={formData[field.key]}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
              />
            )}

            {/* Handle single select */}
            {field.type === "select" && !field.format?.multiple && (
              <select
                value={formData[field.key]}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
              >
                {field.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option === true ? "Yes" : option === false ? "No" : option}
                  </option>
                ))}
              </select>
            )}

            {/* Handle multi-select using DropDown */}
            {field.type === "select" && field.format?.multiple && (
              <DropDown
                options={field.options}
                value={formData[field.key]}
                name={field.key}
                onChange={handleInputChange}
              />
            )}
          </div>
        )
      ))}
      <button type="submit">Create Item</button>
    </form>
  );
}
