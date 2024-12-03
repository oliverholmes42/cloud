import React, { useContext, useEffect, useState } from 'react';
import data from '../../data/categories.json';
import ItemTable from '../../components/items/ItemTable/ItemTable';
import { useStack } from '../../StackContext';
import AddItem from '../../components/items/ItemForm/ItemForm';
import ticketScreens from '../../data/ticketScreens.json';
import { fetchProductGroup, SaveProductGroup } from '../../api/api';
import { AuthContext } from '../../AuthContext';

export default function Categories(){
    const [tableData, setTableData] = useState(data);
    const {token, location} = useContext(AuthContext);
    const {push} = useStack();

    const fetchData = async () => {
      setTableData(null);
      try {
          const result = await fetchProductGroup(token, location.location.sid);
          setTableData(result)
      } catch (error) {
          console.error("Error fetching:", error);
      }
  };

    useEffect(()=>{
      fetchData();
    },[])

    const field = [
        {key: 'name',title: 'Namn', type: 'text', mobile: 1 },
        {key: 'tax', title: 'Moms',type: 'number', format: { type: 'percentage', decimals: 2 },mobile: 2},
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
      {key: ["var00", "v0katnr"], type: "read", title: "ID"},
      {key: ["var00","v0text"], type: "text", title: "Namn", format:{language: "SWE"}},
      {key: ["var00","v0kontonr1"], type: "text", title: "Konto 1", advanced: "Konto"},
      {key: ["var00","v0moms"], type: "text", title: "Moms 1", advanced: "Konto", format: {substring: [0,2]}},
      {key: ["var00","v0kontonr2"], type: "text", title: "Konto 2", advanced: "Konto"},
      {key: ["var00","v0moms"], type: "text", title: "Moms 2", advanced: "Konto", format: {substring: [2,4]}},
      {key: ["var00","v0kontonr3"], type: "text", title: "Konto 3", advanced: "Konto"},
      {key: ["var00","v0moms"], type: "text", title: "Moms 3", advanced: "Konto", format: {substring: [4,6]}},
      {key: ["var00","v0ordn"], type: "number", title: "sortering", format: {decimals: 0}},
      {key: ["var00","v0upddat"], type: "read", title: "Uppdaterad", format: {type: "date"}}
    ]

      const handleSave = async (updatedItem) => {
        const reponse = await SaveProductGroup(token, location.location.sid, updatedItem);
        if(reponse === "000"){
          console.log("success")
        }
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
