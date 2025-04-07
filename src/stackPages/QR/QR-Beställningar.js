import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../AuthContext";
import {useStack} from "../../StackContext";
import {cop, fetchOrders, fetchReceiptList, getOrder} from "../../api/api";
import {customChecksum} from "../reports/RecieptsPage";
import Receipt from "../../components/Reciept/Receipt";
import ItemTable from "../../components/items/ItemTable/ItemTable";
import Order from "../../components/Reciept/Order";


export default function QRBestäLlningar(){
    const [data, setData] = useState(null);
    const {token, location} = useContext(AuthContext);

    const {push} = useStack();

    const fetchData = async () => {
        setData([])
        const response = await fetchOrders(token, location.location.sid) ?? []
        setData(response.map((item) => ({
            ...item, // Keep existing properties
            link: `https://kvitto.spaider.nu/?s=${location.location.sid}&d=${item?.order00?.datum||0}&o=${item?.order00?.orderid.trim()||0}&c=${customChecksum(location.location.sid, item?.order00?.datum||0,item?.order00?.orderid.trim()||0)}` // Add a link key with a value based on the item properties
        })));
    }

    useEffect(()=>{
        fetchData();
    },[])

    const openReciept = async (item) => {
        const res = await getOrder(item.order00.orderid, location.location.sid) ?? {}
        console.log(res);

        const route = {title: `${res.order.order00.datum}-${res.order.order00.orderid}`, page: <Order data={res}/> }
        push(route)
    }

    const customFunction = {title: "Visa", function: openReciept};

    const fields = [
        {key: ["order00", "datum"], title:"datum", type:"read", format:{type: "date"}},
        {key: ["order00", "orderid"], title:"Notanr", type: "read", search: 'value', mobile: 1},
        {key:  ["order00","bord"], title:"Bord", type: "read", search: 'value', mobile: 2},
        {key: ["order00","belopp"], title:"Summa", type:"read", format:{type: "currency"}, search:"span", mobile: 4},
        {key: ["order00", "paid"], title:"Betald", type:"read", search: 'value', format: {
                type: "bool",
                trueValue: "1",
                trueText: "Betald",
                falseText: "Obetald"
            }, mobile: 5},
        {key: "link", title: "länk", type: "read", format:{type: "link", title: "Visa i ny flik"}}

    ]
    return<ItemTable data={data} fields={fields} customFunction={customFunction} canEdit={false} canRemove={false} canAdd={false}/>
}