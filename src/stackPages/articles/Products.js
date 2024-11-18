import React, { useContext, useEffect, useState } from 'react';
import ItemTable from '../../components/ItemTable/ItemTable';
import { fetchProducts } from '../../api/api';
import { AuthContext } from '../../AuthContext';

export default function Products() {
  const [tableData, setTableData] = useState(null);
  const {token, location} = useContext(AuthContext);
  const [limit, setLimit] = useState(100);
  const [page, setPage]  = useState(1);

  const fetchData = async () => {
    setTableData(null);
    try {
        const offset = (page - 1) * limit;
        const result = await fetchProducts(token, location.location.sid, limit, offset);
        setTableData(result);
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

  useEffect(()=>{
    fetchData();
  },[page, limit])

  
  const fields = [{key: ["plu00", "p0namn"], type: "text", title: "Namn"}];


  return (<>
      <ItemTable
        fields={fields}
        data={tableData}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
    </>
  );
}
