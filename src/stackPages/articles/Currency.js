import {useContext, useEffect, useState} from "react";
import ItemTable from "../../components/ItemTable/ItemTable";
import { useStack } from "../../StackContext";
import {fetchCurrency, fetchTax} from "../../api/api";
import { AuthContext } from '../../AuthContext';

export default function Currency(){
    const [tableData, setTableData] = useState([]); // Manage the table data for editing
    const {token, location} = useContext(AuthContext);
    const {push} = useStack();

    const fields = [
        {key: ["val00","v0kod"],title: "PLU", type: "read", mobile: 1 },
        {key: ["val00","v0txt"],title: "Text", type: "read", mobile: 2 },
        {key: ["val00","v0pris"], title: "Pris", type: "read", format:{type: "currency"}, mobile: 4},
        {key: ["val00","v0relativ"], title: "Varugrupp", type: "text", mobile: 3},
        { key: ["val00","v0upddat"], title: 'Uppdaterat', type: 'read', format: { type: 'date', locale: 'sv-SE' } },

    ]

    const fetchData = async () => {
        setTableData(null);
        try {
            const result = await fetchCurrency(token, location.location.sid);
            setTableData(result)
            console.log(result);
        } catch (error) {
            console.error("Error fetching:", error);
        }
    };

    useEffect(()=>{
        fetchData();
    },[])

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