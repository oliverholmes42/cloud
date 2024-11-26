import { useContext, useEffect, useState } from "react";
import { fetchProducts, fetchSteps } from "../../api/api";
import { AuthContext } from "../../AuthContext";
import ItemTable from "../../components/ItemTable/ItemTable";

export default function ProductSteps(){
    const [steps, setSteps] = useState([]);
    const [products, setProducts] = useState([]);
    const [data, setData] = useState(null);

    const {token, location} = useContext(AuthContext);

    const [limit, setLimit] = useState(100);
    const [page, setPage] = useState(1);

    const getSteps = async () => {
        try {
            const result = await fetchSteps(token, location.location.sid);
            setSteps(result);
        } catch (error) {
            console.error("Error fetching Steps:", error);
        }
    };

    const getProducts = async () => {
        try {
            const result = await fetchProducts(token, location.location.sid,5000);
            setProducts(result);
        } catch (error) {
            console.error("Error fetching Steps:", error);
        }
    };

    useEffect(()=>{
        getProducts();
        getSteps();
    },[])

    const createData = () => {
        const list = [];
        for(let i = 0; i< steps.length;i++){
            const plunr = steps[i].plunr
            const plunrdel = steps[i].plunrdel
            const item = {
                plunr,
                plunrdel 
            };
            for(let j = 0; j<products.length; j++){
                if(products[j].plu00.p0katnr==plunr){
                    item.hNamn = products[j].plu00.p0namn;
                }
                if(products[j].plu00.p0katnr==plunrdel){
                    item.dNamn = products[j].plu00.p0namn;
                }
            }
            list.push(item);
        }
        setData(list);
    }

    const getData = () => {
        const offset = (page - 1) * limit;
        return data && data.slice(offset, offset + limit);
      };
      


    useEffect(()=>{
        if(products.length>0 && steps.length>0){
            createData();
        }
    },[products, steps])

    const fields = [
        {key: "plunr", type:"text", title:"Huvudprodukt"},
        {key: "hNamn", type:"read", title:"Huvudnamn"},
        {key: "plunrdel", type:"text", title:"Subprodukt"},
        {key: "dNamn", type:"read", title:"Delnamn"},
    ]
    return(
        <ItemTable data={getData} fields={fields} page={page} setPage={setPage} limit={limit} setLimit={setLimit} />
    )
}