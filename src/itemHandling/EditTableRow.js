import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import Select from 'react-select/base';
import DropDown from '../components/dropdown/DropDown';

// EditTableRow Component
export default function EditTableRow({ item, fields, onSave, onDelete, onEdit }) {
  const [formData, setFormData] = useState(item);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.select();
    }
  }, [ref]);

  useEffect(()=>{
    console.log(formData)
  },[formData])

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

  const handleMultiChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const save = () => {
    toast.success('Item saved');
    onSave(formData); // Trigger save callback
  };

  const remove = () => {
    toast.success('Item deleted');
    onDelete(item.id); // Trigger delete callback
  };

  // Custom input rendering function
  const renderInput = (field, value, index) => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        save(); // Save the form when Enter is pressed
      }
    };

    if (field.type === 'read') {
      return <span>{value}</span>;
    }

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e, field)}
            ref={index === 0 ? ref : null}
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
          const format = field.format;
          const multiple = (format && format.multiple) || false;
        
          if (multiple) {
            return (
              <DropDown options={field.options} onChange={handleMultiChange} value={value} name={"ticket"} onSave={save}/>
            );
          } else {
            return (
              <select value={value} onChange={(e) => handleInputChange(e, field)} onKeyDown={handleKeyDown}>
                {field.options.map((option, index) => {
                  const value = option.id || option.value || option;
                  const name = option.name || option.title || option;
                  return (
                    <option key={index} value={value}>
                      {name}
                    </option>
                  );
                })}
              </select>
            );
          }
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
    <tr>
      {fields.map((field, index) => (
        !field.advanced&&
        <td key={index}>
          {index === fields.length - 2 ? (
            <button className='hoverable' onClick={onEdit}>Inställningar</button>
          ) : index === fields.length - 1 ? (
            <button className='hoverable delete' onClick={remove}>Radera</button>
          ) : (
            renderInput(field, formData[field.key], index)
          )}
        </td>
      ))}
    </tr>
  );
}
