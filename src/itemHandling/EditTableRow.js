import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import Select from 'react-select/base';
import DropDown from '../components/dropdown/DropDown';
import { getNestedValue } from '../components/ItemTable/ItemTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faGear, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

// EditTableRow Component
export default function EditTableRow({ item, fields, onSave, onDelete, onEdit }) {
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

    if (field.type === 'number') {
      value = parseFloat(value) || 0;
    }

    if (field.type === 'select') {
      value = e.target.value;
    }

    setFormData({
      ...formData,
      [field.key]: value,
    });
  };

  const handleMultiChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const save = () => {
    toast.success('Item saved');
    onSave(formData);
  };

  const remove = () => {
    toast.success('Item deleted');
    onDelete(item.id);
  };

  const renderInput = (field, value, index) => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        save();
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
            <DropDown options={field.options} onChange={handleMultiChange} value={value} name={field.key} onSave={save} />
          );
        } else {
          return (
            <select value={value} onChange={(e) => handleInputChange(e, field)} onKeyDown={handleKeyDown}>
              {field.options.map((option, index) => {
                const optionValue = option.id || option.value || option;
                const optionName = option.name || option.title || option;
                return (
                  <option key={index} value={optionValue}>
                    {optionName}
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
        !field.advanced && (
          <td key={index}>
            {
              renderInput(field, getNestedValue(formData, field.key), index)
            }
          </td>
        )
      ))}
      <td style={{textAlign: "right", paddingRight: "20px"}}>
        <button className='hoverable' onClick={onEdit} style={{marginRight: "20px"}}><FontAwesomeIcon icon={faPenToSquare}/></button>
        <button className='hoverable' onClick={onEdit} style={{marginRight: "20px"}}><FontAwesomeIcon icon={faCopy}/></button>
        <button className='hoverable delete' onClick={remove}><FontAwesomeIcon icon={faTrash}/></button>
      </td>
    </tr>
  );
}
