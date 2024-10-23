import React, { useEffect, useState } from 'react';
import data from '../../data/products.json';
import ItemTable from '../../components/ItemTable/ItemTable';
import SearchBar from '../../components/SearchBar/SearchBar';
import { useStack } from '../../StackContext';
import AddItem from '../ItemForm/ItemForm';

export default function Products() {
  const [tableData, setTableData] = useState(data); // Manage the table data for editing
  const {push} = useStack();

  useEffect(()=>{console.log(tableData)},[tableData])
  const fields = [
    { key: 'name', title: 'Namn', type: 'text', mobile: 1 },
    { key: 'category', title: "Kategori", type: 'select', options: ["Öl", "Vin", "Drink", "Alkoholfritt"], mobile: 2 },
    { key: 'selling_price', title: 'Pris', type: 'number', format: { type: 'number', suffix: ' kr' }, mobile: 4 },
    { key: 'tax_rate', title: 'Moms', type: 'number', format: { type: 'percentage'} }, 
    { key: 'alcohol_content', title: 'Alkoholhalt', type: 'number', format: { type: 'percentage'}, advanced: "Product Info" }, 
    { key: 'sku', title: 'SKU', type: 'text', advanced: 'Product Info' },  // Advanced: Product Info
    { key: 'cost_price', title: 'Inköpspris', type: 'number', format: { type: 'number', suffix: ' kr' }, advanced: 'Pricing Info' },  // Advanced: Pricing Info
    { key: 'in_stock', title: 'I Lager', type: 'select', options: ["Ja", "Nej"], advanced: 'Pricing Info' },  // Advanced: Stock Info
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


  return (<>
      <ItemTable
        fields={fields}
        data={tableData}
        onSave={handleSave}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </>
  );
}
