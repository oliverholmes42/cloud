import React, { useContext, useEffect, useState } from 'react';
import ItemTable from '../../components/ItemTable/ItemTable';
import { fetchProducts } from '../../api/api';
import { AuthContext } from '../../AuthContext';

export default function Products() {
  const [tableData, setTableData] = useState([]);
  const {token, location} = useContext(AuthContext);

  useEffect(()=>{
    const fetchData = async () => {
        try {
            const result = await fetchProducts(token, location.location.sid);
            setTableData(result);
        } catch (error) {
            console.error("Error fetching:", error);
        }
    };
    fetchData();
},[])

  
  const fields = [{key: ["plu00", "p0namn"], type: "text", title: "Namn"}];


  return (<>
      <ItemTable
        fields={fields}
        data={tableData}
      />
    </>
  );
}
