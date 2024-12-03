import {useContext, useEffect, useState} from "react";
import ItemTable from "../../components/items/ItemTable/ItemTable";
import data from "../../data/taxCodes.json"
import { useStack } from "../../StackContext";
import {fetchProductGroup, fetchTax} from "../../api/api";
import { AuthContext } from '../../AuthContext';

export default function TaxCodes(){
    const [tableData, setTableData] = useState(data); // Manage the table data for editing
    const {token, location} = useContext(AuthContext);
    const {push} = useStack();

    const fields = [
        {key: ["mom00","m0kod"],title: "Kod", type: "read", mobile: 1 },
        {key: ["mom00","m0txt"],title: "Namn", type: "read", mobile: 2 },
        {key: ["mom00","m0moms"], title: "Moms", type: "read", format: { type: 'percentage', decimals: 2 }, mobile: 4},
        {key: ["mom00","m0konto"], title: "Konto", type: "text", mobile: 3},
        { key: ["mom00","m0upddat"], title: 'Uppdaterat', type: 'read', format: { type: 'date'} },

    ]

    const fetchData = async () => {
        setTableData(null);
        try {
            const result = await fetchTax(token, location.location.sid);
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
