import React, { useContext, useEffect, useState } from 'react';
import data from '../../data/categories.json';
import ItemTable from '../../components/items/ItemTable/ItemTable';
import { useStack } from '../../StackContext';
import AddItem from '../../components/items/ItemForm/ItemForm';
import ticketScreens from '../../data/ticketScreens.json';
import { fetchAddons } from '../../api/api';
import { AuthContext } from '../../AuthContext';

export default function Addons(){
    const [tableData, setTableData] = useState([]);
    const {token, location} = useContext(AuthContext);
    const {push} = useStack();

    const fetchData = async () => {
      setTableData(null);
      try {
          const result = await fetchAddons(token, location.location.sid);
          setTableData(result)
          console.log(result);
      } catch (error) {
          console.error("Error fetching:", error);
      }
  };

    useEffect(()=>{
      fetchData();
    },[])

    const field = [
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

    const fields = [
      {key: "id", type: "read", title: "ID", mobile:3},
      {key: "text", type: "text", title: "Namn", format:{language: "SWE"},mobile:1}
    ]

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
          {
          <ItemTable
              fields={fields}
              data={tableData}
              onSave={handleSave}


          /> }
          {/*tableData && tableData.map((item,index) => (console.log(item))) */}
    </>
    )
}
