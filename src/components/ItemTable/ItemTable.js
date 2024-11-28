import React, { useEffect, useState } from 'react';
import EditTableRow from '../../itemHandling/EditTableRow';
import styles from './ItemTable.module.css'; // Use your provided module.css
import SearchBar from '../SearchBar/SearchBar';
import FloatingButton from '../FloatingButton/FloatingButton';
import { useStack } from '../../StackContext';
import ItemForm from '../../stackPages/ItemForm/ItemForm';

export function getNestedValue (obj, key){
  if (Array.isArray(key)) {
      return key.reduce((acc, part) => acc && acc[part], obj);
  }
  return key.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// Custom table component
export default function ItemTable({ fields, data, onSave, onDelete, onAdd, page, setPage, limit, setLimit }) {
  const [selectedRow, setSelectedRow] = useState(null); // State to track the selected row
  const [multi, setMulti] = useState([]);
  const {push} = useStack();
  const [filteredData, setFilteredData] = useState(data);
  const [inputPage, setInputPage] = useState(page);

  useEffect(()=>{setFilteredData(data)},[data])

  useEffect(()=>{setInputPage(page)},[page])

  const mobileFields = fields
    .filter(field => field.mobile)
    .sort((a, b) => a.mobile - b.mobile);

  // Format the value based on the provided format
  const formatValue = (value, field) => {
    const format = field && field.format;
    if (!format) return value;

    // Handle number formatting with decimals, prefix, and suffix
    if (format.type === 'number') {
      let numericValue;
    
      // Check if the value is a string and try to parse it as a number
      if (typeof value === 'string') {
        // Remove leading zeros, then ensure it's at least "0.00" format
        const strippedValue = value.replace(/^0+/, '') || '0';
        const integerPart = strippedValue.slice(0, -2) || '0'; // Everything except the last two digits
        const decimalPart = strippedValue.slice(-2).padStart(2, '0'); // Last two digits as decimals
        numericValue = parseFloat(`${integerPart}.${decimalPart}`);
      } else if (typeof value === 'number') {
        numericValue = value / 100; // Directly convert to decimals
      } else {
        numericValue = NaN; // Invalid value
      }
    
      if (!isNaN(numericValue)) {
        const formattedValue = numericValue.toFixed(format.decimals || 0);
        return `${format.prefix || ''}${formattedValue}${format.suffix || ''}`;
      } else {
        console.warn('Value could not be converted to a valid number:', value);
        return `${format.prefix || ''}${format.suffix || ''}`; // Return just the prefix and suffix if invalid
      }
    }
    
    
    

    // Handle percentage formatting
    if (format.type === 'percentage' && typeof value === 'number') {
      const percentageValue = (value * 100).toFixed(format.decimals || 0);
      return `${percentageValue}%`;
    }

    // Handle date formatting
    if (format.type === 'date' && value) {
      // Handle input format like "240528"
      if (typeof value === 'string' && value.length === 6) {
        const year = `20${value.slice(0, 2)}`; // Extract year and add "20" prefix
        const month = value.slice(2, 4); // Extract month
        const day = value.slice(4, 6); // Extract day
        return `${year}-${month}-${day}`; // Return formatted string
      } else {
        console.warn('Invalid date format:', value);
        return null; // Return null for invalid inputs
      }
    }

    if (format.language === "SWE" && value){
        const string = value.toString().toswe();
        return string;
    }

    if(format.substring && value){
      return value.toString().substring(format.substring[0], format.substring[1])
    }
    
    

    if (format.type === 'select') {

      if (Array.isArray(value) && value.length > 0) {
        const firstItem = field.options.find(item => item.id === value[0]);
        
        if (!firstItem) {
          return 'Inga';  // If first item not found, return default "Inga"
        }
        
        const valuesLeft = value.length - 1;
        return valuesLeft > 0 ? `${firstItem.name} +${valuesLeft}` : firstItem.name;
      }
      else{
        const formattedValue = field.options.find(item => item.id === value);
        return formattedValue ? formattedValue.name : 'Unknown';  // Return name or fallback if not found
      }
      // Handle single number case
      
      
      
      // Handle array case
      
      
      return 'Inga';  // Return default if the array is empty or not an array
    }
    
    return value; // Default return if no formatting applies
  };

  const EditInMobile = (item) => {
    const page = (
      <ItemForm 
        initialData={item}   // Pass the item data for editing
        fields={fields} 
        onSubmit={onSave}    // Use onSave for editing
        isEditMode={true}    // Set edit mode to true
        onDelete={onDelete}  // Pass the delete function
      />
    );
    push({ page, title: "Redigera" });
  }
  
  const goToAdd = () => {
    const page = (
      <ItemForm
        fields={fields} 
        onSubmit={onAdd}    // Use onAdd for creating a new item
        isEditMode={false}  // Set edit mode to false for adding
      />
    );
    push({ page, title: "Lägg Till Ny" });
  }
  
  const search = (query) => {
    if(query.length > 1){
    setFilteredData((prevData) => {
      // Filter the previous data based on the query
      return prevData.filter(item =>
        
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    });}
    else{
      setFilteredData(data);
    }
  };

  const changePage = (change = inputPage) => {
    switch (change){
      case '+':
        setPage((prev)=>prev+1);
        break;
      case '-':
        if(page>1){
          setPage((prev)=>prev-1);
        }
      default:
        if(change>0){
          setPage(change);
        }

    }
  }

  

  
  

  return (
    <>
      <div style={{ display: "flex", padding: "10px", justifyContent: "space-between" }}>
        <button className="hoverable desktop" onClick={goToAdd}>Skapa ny</button>
        <FloatingButton className="mobile" text="Lägg till Ny" onClick={goToAdd} />
        <SearchBar onSearch={search} />
      </div>
      {page && limit && (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", alignItems: "center" }}>
    {/* Page Size Selector */}
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <label style={{ fontWeight: "bold" }}>Antal per sida: </label>
      <select
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        style={{
          padding: "5px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      >
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={500}>500</option>
        <option value={1000}>1000</option>
        <option value={10000}>Alla</option>
      </select>
    </div>

    {/* Page Navigator */}
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <button
        onClick={() => changePage('-')}
        style={{
          padding: "5px 10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        &lt;
      </button>
      <input
        type="number"
        value={inputPage}
        onChange={(e) => setInputPage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            changePage();
          }
        }}
        style={{
          width: "40px",
          textAlign: "center",
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "5px",
        }}
      />
      <button
        onClick={() => changePage('+')}
        style={{
          padding: "5px 10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        &gt;
      </button>
    </div>
  </div>
)}

      <table className={`${styles.table} desktop`} cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            {fields.map((field, index) => (
              !field.advanced && (
                <th key={index} className={styles.th}>
                  {field.title.toUpperCase()}
                </th>
              )
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredData === null ? (
            // Display loading message under headers
            <tr>
              <td
                colSpan={fields.filter(field => !field.advanced).length + 1}
                style={{ textAlign: "center", padding: "20px" }}
              >
                Loading...
              </td>
            </tr>
          ) : (
            filteredData && filteredData.map((item, index) => (
              index === selectedRow ? (
                <EditTableRow
                  key={index}
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
                  onEdit={() => EditInMobile(item)}
                />
              ) : (
                <tr
                  key={index}
                  onDoubleClick={() => setSelectedRow(index)}
                  className={index % 2 === 0 ? '' : styles.oddRow}
                  

                >
                  {fields.map((field, fieldIndex) => (
                    !field.advanced && (
                      <td key={fieldIndex} className={styles.td}>
                        {formatValue(getNestedValue(item, field.key), field)}
                      </td>
                    )
                  ))}
                  <td>
                  <input 
                      type='checkbox' 
                      onChange={(e) => {
                        e.target.checked
                          ? setMulti((prev) => [...prev, index]) // Add index to the array
                          : setMulti((prev) => prev.filter((item) => item !== index)); // Remove index from the array
                      }}
                    />

                  </td>
                </tr>
              )
            ))
          )}
        </tbody>
      </table>
      <div className="mobile">
        {filteredData && filteredData.map((item, fieldIndex) => (
          <div
            key={fieldIndex}
            className={`${styles.mobileItem} block`}
            onClick={() => EditInMobile(item)}
          >
            {/* Render the fields in two columns */}
            <div className={styles.mobileColumn}>
              {/* First Column: 1, 2, 3 */}
              {mobileFields
                .filter(field => field.mobile <= 3)
                .map((field) => (
                  <div key={field.key}>
                    {field.mobile === 1 && <h3>{formatValue(getNestedValue(item, field.key), field)}</h3>}
                    {field.mobile === 2 && <h4 style={{ color: "var(--darkAccent)" }}>{formatValue(getNestedValue(item, field.key), field)}</h4>}
                    {field.mobile === 3 && <h5>{formatValue(getNestedValue(item, field.key), field)}</h5>}
                  </div>
                ))}
            </div>
            <div className={styles.mobileColumn}>
              {/* Second Column: 4, 5 */}
              {mobileFields
                .filter(field => field.mobile > 3)
                .map((field) => (
                  <div key={field.key}>
                    {field.mobile === 4 && <h3>{formatValue(getNestedValue(item, field.key), field)}</h3>}
                    {field.mobile === 5 && <h5>{formatValue(getNestedValue(item, field.key), field)}</h5>}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
  
  
}
