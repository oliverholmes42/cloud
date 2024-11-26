import {useContext, useEffect, useState} from "react";
import ItemTable from "../../components/ItemTable/ItemTable";
import { useStack } from "../../StackContext";
import {fetchBQ_bqn, fetchPays, fetchTax} from "../../api/api";
import { AuthContext } from '../../AuthContext';

export default function Bongs(){
    const [tableData, setTableData] = useState([]); // Manage the table data for editing
    const {token, location} = useContext(AuthContext);
    const {push} = useStack();
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const fields = [
        {key: ["bet00","b0kod"],title: "Bet", type: "read", mobile: 1 },
        {key: ["bet00","b0txt"],title: "Text", type: "read", mobile: 2 },
        {key: ["bet00","b0red"], title: "Sortering", type: "read", format:{type: "currency"}, mobile: 4},
        {key: ["bet00","b0kontonr"], title: "Kontonr", type: "number", mobile: 3},
        { key: ["bet00","b0upddat"], title: 'Uppdaterat', type: 'read', format: { type: 'date', locale: 'sv-SE' } },

    ]

    const fetchData = async () => {
        setTableData(null);
        try {
            const result = await fetchBQ_bqn(token, location.location.sid);
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
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            {/*
        <ItemTable
        fields={fields}
        data={tableData}
        onSave={handleSave}
        onDelete={handleDelete}
        onAdd={handleAdd}
      /> */}
        </>
    )
}