import React, { useState } from 'react';
import EditTableRow from '../../itemHandling/EditTableRow';
import styles from './ItemTable.module.css'; // Use your provided module.css

// Custom table component
export default function ItemTable({ fields, data, onSave, onDelete }) {
  const [selectedRow, setSelectedRow] = useState(null); // State to track the selected row

  // Format the value based on the provided format
  const formatValue = (value, format) => {
    if (!format) return value;

    // Handle number formatting with decimals, prefix, and suffix
    if (format.type === 'number' && typeof value === 'number') {
      const formattedValue = value.toFixed(format.decimals || 0);
      return `${format.prefix || ''}${formattedValue}${format.suffix || ''}`;
    }

    // Handle percentage formatting
    if (format.type === 'percentage' && typeof value === 'number') {
      const percentageValue = (value * 100).toFixed(format.decimals || 0);
      return `${percentageValue}%`;
    }

    // Handle date formatting
    if (format.type === 'date' && value) {
      const dateValue = new Date(value);
      return dateValue.toLocaleDateString(format.locale || 'en-US', format.options || {});
    }

    return value; // Default return if no formatting applies
  };

  return (
    <table className={styles.table} cellPadding="10" cellSpacing="0">
      <thead>
        <tr>
          {fields.map((field, index) => (
            <th key={index} className={styles.th}>
              {field.title.toUpperCase()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          index === selectedRow ? (
            <EditTableRow
              key={item.id}
              item={item}
              fields={fields}
              onSave={(updatedItem) => {
                onSave(updatedItem);
                setSelectedRow(null); // Exit edit mode after saving
              }}
              onDelete={(id) => {
                onDelete(id);
                setSelectedRow(null); // Exit edit mode after deleting
              }}
            />
          ) : (
            <tr
              key={item.id}
              onClick={() => setSelectedRow(index)}
              className={index % 2 === 0 ? '' : styles.oddRow}
            >
              {fields.map((field, fieldIndex) => (
                <td key={fieldIndex} className={styles.td}>
                  {formatValue(item[field.key], field.format)}
                </td>
              ))}
            </tr>
          )
        ))}
      </tbody>
    </table>
  );
}
