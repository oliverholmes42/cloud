import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useStack } from '../StackContext';
import DropDown from '../components/dropdown/DropDown'; // Assuming DropDown is in the same directory

// EditForm Component
export default function EditItem({ data, fields, onSave, onDelete }) {
  const [formData, setFormData] = useState(data);
  const [expandedSection, setExpandedSection] = useState(null); // Tracks the currently expanded section
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
    toast.success('Artikel borttagen');
    onDelete(data.id);
    pop();
  };

  const toggleSection = (sectionName) => {
    // If the clicked section is already expanded, collapse it. Otherwise, expand the clicked one and collapse the others.
    setExpandedSection((prev) => (prev === sectionName ? null : sectionName));
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

  // Group fields into "basic" and "advanced"
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
    <div className="edit-form-wrapper">
      <form className="edit-form">
        {/* Basic Fields */}
        <h2>Basic Information</h2>
        {basicFields.map((field, index) => (
          <div key={index} className="form-group">
            <label htmlFor={field.key}>{field.title}</label>
            {renderInput(field, formData[field.key], index)}
          </div>
        ))}
        {/* Save/Delete Buttons */}
        <div className="form-actions">
          <button type="button" className="hoverable" onClick={save}>
            Save
          </button>
          <button type="button" className="hoverable delete" onClick={remove}>
            Delete
          </button>
        </div>
      </form>

      {/* Advanced Fields */}
      {Object.keys(advancedSections).map((sectionName, sectionIndex) => (
        <div key={sectionIndex} className="advanced-section">
          <h2 onClick={() => toggleSection(sectionName)} style={{ cursor: 'pointer' }}>
            {sectionName} {expandedSection === sectionName ? '-' : '+'}
          </h2>
          {expandedSection === sectionName && (
            <form className="edit-form">
              {advancedSections[sectionName].map((field, index) => (
                <div key={index} className="form-group">
                  <label htmlFor={field.key}>{field.title}</label>
                  {renderInput(field, formData[field.key], index)}
                </div>
              ))}
            </form>
          )}
        </div>
      ))}
    </div>
  );
}
