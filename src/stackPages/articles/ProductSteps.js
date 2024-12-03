import { useContext, useEffect, useState } from "react";
import { fetchProducts, fetchSteps } from "../../api/api";
import { AuthContext } from "../../AuthContext";
import ItemTable from "../../components/items/ItemTable/ItemTable";

export default function ProductSteps() {
    const [steps, setSteps] = useState([]);
    const [products, setProducts] = useState([]);
    const [data, setData] = useState(null);

    const { token, location } = useContext(AuthContext);

    const [limit, setLimit] = useState(100);
    const [page, setPage] = useState(1);

    const courses = [
        "Ingen",
        "Förrätt",
        "Varmrätt",
        "Efterrätt",
        "Take-Away",
    ]; // Static courses array

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
            const result = await fetchProducts(token, location.location.sid, 5000);
            const transformedProducts = result.map((product) => ({
                id: product.plu00.p0katnr,
                name: product.plu00.p0namn,
                barcode: product.plu00.p0brkod,
            }));
            setProducts(transformedProducts);
        } catch (error) {
            console.error("Error fetching Products:", error);
        }
    };

    useEffect(() => {
        getProducts();
        getSteps();
    }, []);

    const createData = () => {
        const list = steps.map((step) => {
            const plunrProduct = products.find(
                (product) => product.id === step.plunr
            );
            const plunrdelProduct = products.find(
                (product) => product.id === step.plunrdel
            );

            return {
                plunr: step.plunr,
                plunrdel: step.plunrdel,
                hNamn: plunrProduct?.name || "Unknown",
                p0brkod: plunrProduct?.barcode || "Unknown",
                ratt1: courses[plunrProduct?.barcode || 0],
                dNamn: plunrdelProduct?.name || "Unknown",
                p0brkod2: plunrdelProduct?.barcode || "Unknown",
                ratt2: courses[plunrdelProduct?.barcode || 0],
            };
        });

        setData(list);
    };

    useEffect(() => {
        if (products.length > 0 && steps.length > 0) {
            createData();
        }
    }, [products, steps]);

    const getData = () => {
        const offset = (page - 1) * limit;
        return data ? data.slice(offset, offset + limit) : [];
    };

    const fields = [
        { key: "plunr", type: "read", title: "Huvudprodukt" },
        { key: "hNamn", type: "read", title: "Huvudnamn" },
        { key: "ratt1", type: "read", title: "Rätt" },
        {
            key: "plunrdel",
            type: "select",
            title: "Subprodukt",
            format: { type: "single", options: products },
        },
        { key: "ratt2", type: "read", title: "Rätt" },
    ];

    return (
        <ItemTable
            data={getData()}
            fields={fields}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
        />
    );
}
