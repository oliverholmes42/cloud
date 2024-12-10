import React, { useContext, useEffect, useState } from "react";
import ItemTable from "../../components/items/ItemTable/ItemTable";
import {cop, copyReceipt, fetchReceiptList} from "../../api/api";
import { AuthContext } from "../../AuthContext";
import Receipt from "../../components/Reciept/Receipt";
import {useStack} from "../../StackContext";
import Products from "../articles/Products";

export default function RecieptsPage(){
    const [data, setData] = useState(null);
    const {token, location} = useContext(AuthContext);
    const [fDate, setFDate] = useState("2024-11-24");

    const [tDate, setTDate] = useState("2024-11-25");


    const {push} = useStack();

    const fetchData = async () => {
        setData([])
        const response = await fetchReceiptList(token, location.location.sid, fDate.slice(2), tDate.slice(2))
        setData(response.rca.map((item) => ({
            ...item, // Keep existing properties
            link: `https://kvitto.spaider.nu/?s=${location.location.sid}&d=${item?.datum||0}&n=${item?.notanr.trim()||0}&c=${customChecksum(location.location.sid, item?.datum||0,item?.notanr.trim()||0)}` // Add a link key with a value based on the item properties
        })));

    }

    function customChecksum(s, d, n) {
        // Custom logic here
        // Example: Multiply ASCII codes of characters
        const inputString = `${s}${d}${n}`;
        let product = 1;
        for (let i = 0; i < inputString.length; i++) {
            product *= inputString.charCodeAt(i);
        }
        const checksum = (product % 1000000).toString().padStart(6, '0');
        return checksum;
    }

    const fields = [
        {key: "datum", title:"datum", type:"read", format:{type: "date"}},
        {key: "notanr", title:"Notanr", type: "read", search: 'value'},
        {key: "fsg", title:"Summa", type:"read", format:{type: "currency"}, search:"span"},
        {key: "link", title: "länk", type: "read", format:{type: "link", title: "Visa i ny flik"}}

    ]

    useEffect(()=>{
        fetchData();
    },[])



    const openReciept = async (item) => {
        console.log(item.datum);
        console.log(item.notanr);
        const data = await cop(token, location.location.sid, item.datum, item.notanr);
        //console.log(data.rco);
        const route = {title: `${item.datum}-${item.notanr}`, page: <Receipt data={data.rco} /> }
        push(route)
    }

    const date = {
        from : {value: fDate, set: setFDate},
        to : {value: tDate, set: setTDate},
        apply : fetchData
    };

    const customFunction = {title: "Visa", function: openReciept};


    return(<ItemTable data={data} fields={fields} date={date} customFunction={customFunction}/>
    )
}
