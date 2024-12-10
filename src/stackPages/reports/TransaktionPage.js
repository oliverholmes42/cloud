import {fetchTransactionList} from "../../api/api";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../AuthContext";
import ItemTable from "../../components/items/ItemTable/ItemTable";

export default function TransaktionPage(){
    const [data, setData] = useState(null);
    const [fDate, setFDate] = useState("2024-11-24");
    const [tDate, setTDate] = useState("2024-11-25");

    const {token, location} = useContext(AuthContext);

    const fetchData = async () => {
        setData(null)
        const reponse = await fetchTransactionList(token, location.location.sid, fDate.slice(2), tDate.slice(2))
        setData(reponse.rca);
    }

    useEffect(() => {
        fetchData()
    }, []);

    const options = ["Betalning", "Produkt"]

    const fields = [
        {key: "r0datum", type: "read", title: "Datum", format:{type: "date"}},
        {key: "r0time", type: "read", title: "Tid"},
        {key: "r0tablnr", type: "read", title: "Bord"},
        {key: "r0faktnr", type: "read", title: "Nota"},
        {key: "r0text", type: "read", title: "Produkt"},
        {key: "r0noof", type: "read", title: "Antal", format:{type:"number"}},
        {key: "r0perprice", type: "read", title: "Pris", format:{type: "currency"}},
        {key: "r0debcre", type: "read", title: "Typ"}
    ]

    const date = {
        from : {value: fDate, set: setFDate},
        to : {value: tDate, set: setTDate},
        apply : fetchData
    };
    return(
        <ItemTable data={data} date={date} fields={fields} canEdit={false} canRemove={false}/>
    )
}
