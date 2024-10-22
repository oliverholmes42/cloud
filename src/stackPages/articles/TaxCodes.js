import { useState } from "react";
import ItemTable from "../../components/ItemTable/ItemTable";
import data from "../../data/taxCodes.json"
import { useStack } from "../../StackContext";

export default function TaxCodes(){
    const [tableData, setTableData] = useState(data); // Manage the table data for editing
    const {push} = useStack();

    const fields = [
        {key: "name",title: "Namn", type: "text", mobile: 1 },
        {key: "moms", title: "Moms", type: "read", format:{type: "percentage"}, mobile: 4},
        {key: "account", title: "Konto", type: "text", mobile: 2},
        { key: 'created_at', title: 'Created At', type: 'read', format: { type: 'date', locale: 'sv-SE', options: { year: 'numeric', month: 'long', day: 'numeric' } } },
        { key: 'updated_at', title: 'Updated At', type: 'read', format: { type: 'date', locale: 'sv-SE' } }, 

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
        <ItemTable
        fields={fields}
        data={tableData}
        onSave={handleSave}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    )
}