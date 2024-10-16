import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useStack } from '../StackContext';

// EditForm Component
export default function EditItem({ data, fields, onSave, onDelete }) {
  const [formData, setFormData] = useState(data);
  const ref = useRef(null);
  const { pop } = useStack();

  useEffect(() => {
    if (ref.current) {
      ref.current.focus(); // Focus the first input field on component mount
    }
  }, [ref]);

  const handleInputChange = (e, field) => {
    let value = e.target.value;

    // Parse the value based on field type
    if (field.type === 'number') {
      value = parseFloat(value) || 0; // Convert to float, handle empty or invalid input
    }

    if (field.type === 'select') {
      value = e.target.value; // Select value stays as string
    }

    // Update formData with parsed value
    setFormData({
      ...formData,
      [field.key]: value,
    });
  };

  const save = () => {
    toast.success('Item saved');
    onSave(formData); // Trigger save callback with updated data
    pop();
  };

  const remove = () => {
    toast.success('Item deleted');
    onDelete(data.id); // Trigger delete callback
  };

  // Custom input rendering function
  const renderInput = (field, value, index) => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        save(); // Save the form when Enter is pressed
      }
    };

    if (field.type === 'read') {
      return null; // Do not render anything for read-only fields
    }

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e, field)}
            ref={index === 0 ? ref : null} // Focus on the first input field
            onKeyDown={handleKeyDown}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(e, field)}
            ref={index === 0 ? ref : null}
            onKeyDown={handleKeyDown}
          />
        );
      case 'select':
        return (
          <select value={value} onChange={(e) => handleInputChange(e, field)} onKeyDown={handleKeyDown}>
            {field.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e, field)}
            ref={index === 0 ? ref : null}
            onKeyDown={handleKeyDown}
          />
        );
    }
  };

  return (
    <form className="edit-form">
      {fields
        .filter((field) => field.type !== 'read') // Filter out read-only fields
        .map((field, index) => (
          <div key={index} className="form-group">
            <label htmlFor={field.key}>{field.title}</label>
            {renderInput(field, formData[field.key], index)}
          </div>
        ))}
      <div className="form-actions">
        <button type="button" className="hoverable" onClick={save}>
          Save
        </button>
        <button type="button" className="hoverable delete" onClick={remove}>
          Delete
        </button>
      </div>
    </form>
  );
}
