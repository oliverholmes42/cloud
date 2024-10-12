import { useState } from "react";
import { useStack } from "../StackContext";

export default function AddItem({fields, onCreate}){
    const {pop} = useStack();
     // Initialize state for form data
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      acc[field.key] = field.type === 'select' ? field.options[0] : ''; // Set default values based on field type
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
    pop();
    setFormData(fields.reduce((acc, field) => {
      acc[field.key] = field.type === 'select' ? field.options[0] : ''; // Reset form after submission
      return acc;
    }, {}));
  };

  return (
    <form onSubmit={handleSubmit} >
      {fields.map((field) => (
        <div key={field.key} >
          <label >{field.title}</label>
          {field.type === 'text' && (
            <input
              type="text"
              value={formData[field.key]}
              onChange={(e) => handleInputChange(field.key, e.target.value)}

            />
          )}
          {field.type === 'number' && (
            <input
              type="number"
              value={formData[field.key]}
              onChange={(e) => handleInputChange(field.key, e.target.value)}

            />
          )}
          {field.type === 'select' && (
            <select
              value={formData[field.key]}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              
            >
              {field.options.map((option, index) => (
                <option key={index} value={option}>
                  {option === true ? 'Yes' : option === false ? 'No' : option}
                </option>
              ))}
            </select>
          )}
          {field.type === 'read' && (
            <input
              type="text"
              value={formData[field.key]}
              readOnly
            />
          )}
        </div>
      ))}
      <button type="submit" >
        Create Item
      </button>
    </form>
  );
}