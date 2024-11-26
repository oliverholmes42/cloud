import React, { useContext, useEffect, useState } from 'react';
import data from '../../data/categories.json';
import ItemTable from '../../components/ItemTable/ItemTable';
import { useStack } from '../../StackContext';
import AddItem from '../ItemForm/ItemForm';
import ticketScreens from '../../data/ticketScreens.json';
import {fetchAddons, fetchHappyhour} from '../../api/api';
import { AuthContext } from '../../AuthContext';

export default function Happyhour(){
    const [tableData, setTableData] = useState([]);
    const {token, location} = useContext(AuthContext);
    const {push} = useStack();

    const fetchData = async () => {
      setTableData(null);
      try {
          const result = await fetchHappyhour(token, location.location.sid);

          setTableData(Object.values(result))
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
        {key: "wday", type: "read", title: "Veckodag", mobile:1},
        {key: "f01", type: "text", title: "Från 1", format:{language: "SWE"}},
        {key: "t01", type: "text", title: "Till 1", format:{language: "SWE"}},
        {key: "n01", type: "text", title: "Kod 1" },
        {key: "f02", type: "text", title: "Från 2", format:{language: "SWE"}},
        {key: "t02", type: "text", title: "Till 2", format:{language: "SWE"}},
        {key: "n02", type: "text", title: "Kod 2" },
        {key: "f03", type: "text", title: "Från 3", format:{language: "SWE"}},
        {key: "t03", type: "text", title: "Till 3", format:{language: "SWE"}},
        {key: "n03", type: "text", title: "Kod 3" },
        {key: "f04", type: "text", title: "Från 4", format:{language: "SWE"}},
        {key: "t04", type: "text", title: "Till 4", format:{language: "SWE"}},
        {key: "n04", type: "text", title: "Kod 4" },
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


          />  }
          {/*tableData && tableData.map((item,index) => (console.log(item))) */}
    </>
    )
}