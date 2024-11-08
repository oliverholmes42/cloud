import { useContext, useEffect, useState } from "react";
import ItemTable from "../../components/ItemTable/ItemTable";
import { fetchInvoiceCustomers } from "../../api/api";
import { AuthContext } from "../../AuthContext";

export default function Customers(){
    const [data, setData] = useState([]);
    const { token, location } = useContext(AuthContext);

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const result = await fetchInvoiceCustomers(token, location.location.sid);
                setData(result);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchData();
    },[])

    useEffect(()=>{
        console.log(data);
    },[data])

    const fields = [
        {key: ["krr00", "kid"], title: "ID", type: "read"},
        {key: ["krr00", "company"], title: "Företag", type: "text", mobile: 1},
        {key: ["krr00", "namn"], title: "Person", type:"text", mobile: 2},
        {key: ["krr02", "orgnr"], title: "Orgnr", type: "text", mobile: 4}
    ]

    const save = (item) => {
        console.log("Saved item: ", item);
    }


    return(
        <ItemTable data={data} fields={fields} onSave={save}/>
    )

}