import React, { useState } from 'react';

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
export default function EditTableRow({ item, fields }) {
  const [formData, setFormData] = useState(item);

  const handleInputChange = (e, field) => {
    setFormData({
      ...formData,
      [field.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log('Updated data:', formData);
    // Handle save (e.g., update state or send to server)
  };

  return (
    <tr>
      {fields.map((field, index) => (
        <td key={index}>
          <CustomInput
            type={field.type}
            value={formData[field.name]}
            onChange={(e) => handleInputChange(e, field)}
            options={field.options || []}
          />
        </td>
      ))}
    </tr>
  );
}
