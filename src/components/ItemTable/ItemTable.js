import React, { useState } from 'react';
import EditTableRow from '../../itemHandling/EditTableRow';
import styles from './ItemTable.module.css'; // Use your provided module.css
import SearchBar from '../SearchBar/SearchBar';
import FloatingButton from '../FloatingButton/FloatingButton';
import { useStack } from '../../StackContext';
import EditItem from '../../stackPages/EditItem';
import AddItem from '../../stackPages/AddItem';

// Custom table component
export default function ItemTable({ fields, data, onSave, onDelete, onAdd }) {
  const [selectedRow, setSelectedRow] = useState(null); // State to track the selected row
  const {push} = useStack();
  const [filteredData, setFilteredData] = useState(data);

  const mobileFields = fields
    .filter(field => field.mobile)
    .sort((a, b) => a.mobile - b.mobile);

  // Format the value based on the provided format
  const formatValue = (value, field) => {
    const format = field && field.format;
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

    if (format.type === 'select') {
      // Handle single number case
      if (typeof value === 'number') {
        const formattedValue = field.options.find(item => item.id === value);
        return formattedValue ? formattedValue.name : 'Unknown';  // Return name or fallback if not found
      }
      
      // Handle array case
      if (Array.isArray(value) && value.length > 0) {
        const firstItem = field.options.find(item => item.id === value[0]);
        
        if (!firstItem) {
          return 'Inga';  // If first item not found, return default "Inga"
        }
        
        const valuesLeft = value.length - 1;
        return valuesLeft > 0 ? `${firstItem.name} +${valuesLeft}` : firstItem.name;
      }
      
      return 'Inga';  // Return default if the array is empty or not an array
    }
    
    return value; // Default return if no formatting applies
  };

  const EditInMobile = (item) => {
    const page = <EditItem data={item} fields={fields} onSave={onSave} onDelete={onDelete}/>;
    push({page, title:"Redigera"})
  }
  const goToAdd = () => {
    push({page: <AddItem fields={fields} onCreate={onAdd}/>, title: "Lägg Till Ny"})
  }

  const search = (query) => {
    if(query.length > 1){
    setFilteredData((prevData) => {
      // Filter the previous data based on the query
      return prevData.filter(item =>
        // Adjust this condition based on what property you want to search
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    });}
    else{
      setFilteredData(data);
    }
  };
  

  return (<>
  <div style={{display: "flex", padding: "10px", justifyContent: "space-between"}}>
        <button  className="hoverable desktop" onClick={goToAdd}>Skapa ny</button>
        <FloatingButton className="mobile" text="Lägg till Ny" onClick={goToAdd}/>
        <SearchBar onSearch={search}/>
      </div>
    <table className={`${styles.table} desktop`} cellPadding="10" cellSpacing="0">
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
        {filteredData.map((item, index) => (
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
              onEdit={()=>EditInMobile(item)}
            />
          ) : (
            <tr
              key={item.id}
              onClick={() => setSelectedRow(index)}
              className={index % 2 === 0 ? '' : styles.oddRow}
            >
              {fields.map((field, fieldIndex) => (
                <td key={fieldIndex} className={styles.td}>
                  {formatValue(item[field.key], field)}
                </td>
              ))}
            </tr>
          )
        ))}
      </tbody>
    </table>
    <div className='mobile'>
      {filteredData.map((item, fieldIndex) => (
        <div key={fieldIndex} className={`${styles.mobileItem} block`} onClick={()=>EditInMobile(item)}>
          {/* Render the fields in two columns */}
            <div className={styles.mobileColumn}>
              {/* First Column: 1, 2, 3 */}
              {mobileFields
                .filter(field => field.mobile <= 3)
                .map((field) => (
                  <div key={field.key}>
                    {field.mobile === 1 && <h3>{formatValue(item[field.key], field)}</h3>}
                    {field.mobile === 2 && <h4 style={{color: "var(--darkAccent)"}}>{formatValue(item[field.key], field)}</h4>}
                    {field.mobile === 3 && <h5>{formatValue(item[field.key], field)}</h5>}
                  </div>
                ))}
            </div>
            <div className={styles.mobileColumn}>
              {/* Second Column: 4, 5 */}
              {mobileFields
                .filter(field => field.mobile > 3)
                .map((field) => (
                  <div key={field.key}>
                    {field.mobile === 4 && <h3>{formatValue(item[field.key], field)}</h3>}
                    {field.mobile === 5 && <h5>{formatValue(item[field.key], field)}</h5>}
                  </div>
                ))}
            </div>
        </div>
      ))}
    </div>
    </>
  );
}
