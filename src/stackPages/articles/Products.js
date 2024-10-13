import React, { useEffect, useState } from 'react';
import data from '../../data/products.json';
import ItemTable from '../../components/ItemTable/ItemTable';
import SearchBar from '../../components/SearchBar/SearchBar';
import { useStack } from '../../StackContext';
import AddItem from '../AddItem';

export default function Products() {
  const [tableData, setTableData] = useState(data); // Manage the table data for editing
  const {push} = useStack();

  useEffect(()=>{console.log(tableData)},[tableData])
  const fields = [
    { key: 'name', title: 'Namn', type: 'text' },
    { key: 'selling_price', title: 'Pris', type: 'number', format: { type: 'number', suffix: ' kr' } },
    { key: 'tax_rate', title: 'Moms', type: 'number', format: { type: 'percentage'} }, 
    { key: 'alcohol_content', title: 'Alkoholhalt', type: 'number', format: { type: 'percentage'} }, 
    { key: 'created_at', title: 'Created At', type: 'read', format: { type: 'date', locale: 'sv-SE', options: { year: 'numeric', month: 'long', day: 'numeric' } } },
    { key: 'updated_at', title: 'Updated At', type: 'read', format: { type: 'date', locale: 'sv-SE' } }, 
  ];

  const handleSave = (updatedItem) => {
    setTableData((prevData) =>
      prevData.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleDelete = (id) => {
    setTableData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const handleAdd = (newItem) => {
    console.log(newItem)
  };

  const goToAdd = () => {
    push({page: <AddItem fields={fields} onCreate={handleAdd}/>, title: "Ny produkt"})
  }

  return (<>
      <div style={{display: "flex", padding: "10px"}}>
        <button  className="hoverable" onClick={goToAdd}>Skapa ny</button>
        <SearchBar/>
      </div>
      <ItemTable
        fields={fields}
        data={tableData}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
}
