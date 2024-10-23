import React, { useState } from 'react';
import data from '../../data/categories.json';
import ItemTable from '../../components/ItemTable/ItemTable';
import { useStack } from '../../StackContext';
import AddItem from '../ItemForm/ItemForm';
import ticketScreens from '../../data/ticketScreens.json';

export default function Categories(){
    const [tableData, setTableData] = useState(data);
    const {push} = useStack();

    const fields = [
        {key: 'name',title: 'Namn', type: 'text', mobile: 1 },
        {key: 'tax', title: 'Moms',type: 'number', format: { type: 'percentage', decimals: 2 } },
        {key: 'type',title: 'Typ',type: 'select', options: ['Dryck', 'Mat'],mobile: 2 },
        {key: 'visibility', title: 'Synlighet',type: 'select',options: ['Synlig', 'Dold'], format: 'select', mobile: 4},
        {key: 'ticket',title: 'Bongplats',type: 'select', options: ticketScreens, format: {type: 'select', multiple: true},mobile: 3},
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

      const handleAdd = (newItem) => {
        console.log(newItem)
      };
      

    return(
      <>
          <ItemTable
        fields={fields}
        data={tableData}
        onSave={handleSave}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </>
    )
}