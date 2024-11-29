import { useContext, useEffect, useState } from "react";
import ItemTable from "../../components/ItemTable/ItemTable";
import {cop, copyReceipt, fetchReceiptList} from "../../api/api";
import { AuthContext } from "../../AuthContext";
import Receipt from "../../components/Reciept/Receipt";

export default function RecieptsPage(){
    const [data, setData] = useState([]);
    const {token, location} = useContext(AuthContext);

    const fetchData = async () => {
        const response = await fetchReceiptList(token, location.location.sid)
        setData(response.rca)
    }

    const copy = async () => {
        const response = await cop(token, location.location.sid)
        console.log(response)
    }
    useEffect(()=>{
        fetchData();
    },[])

    const fields = [
        {}
    ]
    return(<>
            <h1>HEllo</h1>
            <button onClick={copy}>Copy</button>

            {
                data.length>0 && <Receipt data={data[3]}/>
            }


        </>
    )
}
