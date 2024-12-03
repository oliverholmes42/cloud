import { useContext, useEffect, useState } from "react";
import ItemTable from "../../components/items/ItemTable/ItemTable";
import {cop, copyReceipt, fetchReceiptList} from "../../api/api";
import { AuthContext } from "../../AuthContext";
import Receipt from "../../components/Reciept/Receipt";

export default function RecieptsPage(){
    const [data, setData] = useState(null);
    const {token, location} = useContext(AuthContext);

    const fetchData = async () => {
        const response = await cop(token, location.location.sid)
        setData(response.rco)
    }

    useEffect(()=>{
        fetchData();
    },[])

    return(<>

            {
                data && <Receipt data={data}/>
            }


        </>
    )
}
