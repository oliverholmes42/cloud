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

    useEffect(()=>{
        console.log(products[0])
    },[products])

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
                    item.p0brkod  = products[j].plu00.p0brkod;
                    item.ratt1 = courses[item.p0brkod];
                }
                if(products[j].plu00.p0katnr==plunrdel){
                    item.dNamn = products[j].plu00.p0namn;
                    item.p0brkod2  = products[j].plu00.p0brkod;
                    item.ratt2 = courses[item.p0brkod2]
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

    const courses = ["Ingen","Förrätt", "Varmrätt", "Efterrätt", "Take-Away"]
    /*const courses = [
        {value: 0, name: "Ingen"}, 
        {value: 1, name: "Förrätt"}, 
        {value: 2, name: "Varmrätt" }, 
        {value: 3, name: "Efterrätt"}, // Corrected key
        {value: 4, name: "Take-Away"}
      ];*/
      

    const fields = [
        {key: "plunr", type:"text", title:"Huvudprodukt"},
        {key: "hNamn", type:"read", title:"Huvudnamn"},
        {key: "ratt1", type: "read", title: "Rätt"},
        {key: "plunrdel", type:"select", title:"Subprodukt"},
        {key: "dNamn", type:"read", title:"Delnamn"},
        {key: "ratt2", type: "read", title: "Rätt"}
        
    ]
    return(
        <ItemTable data={getData} fields={fields} page={page} setPage={setPage} limit={limit} setLimit={setLimit} />
    )
}