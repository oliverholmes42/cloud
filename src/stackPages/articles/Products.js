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

  const moms = [{id: "00", name: "Momsfritt"},
    {id: "01", name: "Moms 25%"},
    {id: "02", name: "Moms 12%"},
    {id: "03", name: "Moms 6%"}
  ]


  const fields = [
    {key: ["plu00", "p0katnr"], type: "read", title: "PLU"},
    {key: ["plu02", "p2vgrupp"], type: "read", title: "Varugrupp"},
    {key: ["plu00", "p0pris"], type: "number", title: "Pris", format:{ type: "number", decimals: 2, suffix: " kr"}},
    {key: ["plu00", "p0namn"], type: "text", title: "Namn", format: {language: "SWE"}},
    {key: ["plu00", "p0moms"], type: "select", title: "Moms", format:{type: "select", options:moms}, options: moms},
    {key: ["plu00", "p0upddat"], type: "read", title: "Uppdaterad", format: {type: "date"}}];


  return (<>
      <ItemTable
        fields={fields}
        data={tableData}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        onSave={console.log}
      />
    </>
  );
}
