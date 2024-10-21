import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useStack } from '../StackContext';
import DropDown from '../components/dropdown/DropDown'; // Assuming DropDown is in the same directory

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

  const handleInputChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const save = () => {
    toast.success('Ändringarna sparades');
    onSave(formData); // Trigger save callback with updated data
    pop();
  };

  const remove = () => {
    toast.success('Arikel borttagen');
    onDelete(data.id);
    pop();
  };

  // Custom input rendering function
  const renderInput = (field, value, index) => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        save(); // Save the form when Enter is pressed
      }
    };

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            ref={index === 0 ? ref : null} // Focus on the first input field
            onKeyDown={handleKeyDown}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            ref={index === 0 ? ref : null}
            onKeyDown={handleKeyDown}
          />
        );
      case 'select':
        // If the select field has `format.multiple` set to true, use DropDown component
        if (field.format?.multiple) {
          return (
            <DropDown
              options={field.options} // Pass the options for the dropdown
              value={value} // Pass the current value as an array of selected ids
              name={field.key} // Use the field key as the name
              onChange={handleInputChange} // Handle changes
            />
          );
        }

        // Use native select dropdown for single select
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            onKeyDown={handleKeyDown}
          >
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
            onChange={(e) => handleInputChange(field.key, e.target.value)}
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
