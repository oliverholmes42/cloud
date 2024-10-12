import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

// Custom input renderer based on type
const CustomInput = ({ type, value, onChange, options }) => {
  if (type === 'read') {
    return <span>{value}</span>;
  }

  switch (type) {
    case 'text':
      return <input type="text" value={value} onChange={onChange} />;
    case 'number':
      return <input type="number" value={value} onChange={onChange} />;
    case 'select':
      return (
        <select value={value} onChange={onChange}>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    default:
      return <input type="text" value={value} onChange={onChange} />;
  }
};

// EditTableRow Component
export default function EditTableRow({ item, fields, onSave, onDelete }) {
  const [formData, setFormData] = useState(item);

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
    onSave(formData); // Trigger save callback
  };

  const remove = () => {
    toast.success('Item deleted');
    onDelete(item.id); // Trigger delete callback
  };

  return (
    <tr>
      {fields.map((field, index) => (
        <td key={index}>
          {index === fields.length - 2 ? (
            <button className='hoverable' onClick={save}>Save</button>
          ) : index === fields.length - 1 ? (
            <button className='hoverable delete' onClick={remove}>Radera</button>
          ) : (
            <CustomInput
              type={field.type}
              value={formData[field.key]} // Ensure value is correctly parsed
              onChange={(e) => handleInputChange(e, field)}
              options={field.options || []}
            />
          )}
        </td>
      ))}
    </tr>
  );
}
