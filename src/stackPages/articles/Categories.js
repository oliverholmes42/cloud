import React, { useState } from 'react';
import data from '../../data/categories.json';
import ItemTable from '../../components/ItemTable/ItemTable';

export default function Categories(){
    const [tableData, setTableData] = useState(data);

    const fields = [
        {key: 'name',title: 'Namn',type: 'text', format: null },
        {key: 'tax',
          title: 'Moms',
          type: 'number', 
          format: { type: 'percentage', decimals: 2 } 
        },
        {
          key: 'type',
          title: 'Typ',
          type: 'select', 
          options: ['Dryck', 'Mat'], 
          format: null 
        },
        {
          key: 'visibility',
          title: 'Synlighet',
          type: 'select',
          options: ['Synlig', 'Dold'], 
          format: null 
        },
        {
          key: 'ticket',
          title: 'Bongplats',
          type: 'select', 
          options: ['Bar', 'Kök'], 
          format: null 
        },
        {
          key: 'created_at',
          title: 'Skapades',
          type: 'read', 
          format: { type: 'date', locale: 'en-GB', options: { year: 'numeric', month: 'long', day: 'numeric' } } // Date formatting
        },
        {
          key: 'updated_at',
          title: 'Updaterad',
          type: 'read',
          format: { type: 'date', locale: 'en-GB', options: { year: 'numeric', month: 'long', day: 'numeric' } } // Date formatting
        }
      ];

      const handleSave = (updatedItem) => {
        setTableData((prevData) =>
          prevData.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
      };
    
      const handleDelete = (id) => {
        setTableData((prevData) => prevData.filter((item) => item.id !== id));
      };
      

    return(
        <ItemTable
      fields={fields}
      data={tableData}
      onSave={handleSave}
      onDelete={handleDelete}
    />
    )
}