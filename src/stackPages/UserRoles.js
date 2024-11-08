import { useContext, useEffect, useState } from "react";
import { fetchUsers } from "../api/api";
import { AuthContext } from "../AuthContext";
import ItemTable from "../components/ItemTable/ItemTable";

export default function UserRoles() {
    const [data, setData] = useState([]);
    const { token, location } = useContext(AuthContext);



    useEffect(() => {
        if (token && location?.location?.sid) {
            const fetchData = async () => {
                try {
                    const result = await fetchUsers(token, location.location.sid);
                    setData(result);
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
            };
            fetchData();
        }
    }, [token, location]);

    useEffect(()=>{
        console.log(data);
    },[data])

    const fields = [
        {key: ["ser00", "s0serv"], title: "ID", type: "read"},
        {key: ["ser00", "s0namn"], title: "Namn", type: 'text', mobile: 1},
        {key: ["ser00", "s0kort"], title: "Kort", type: 'text', mobile: 2},
        {key: ["ser00", "s0hkod"], title: "Personkod",type: 'text', mobile: 4},
        {key: ["ser00", "s0kassa"], title: "Kassalåda",type: "text", advanced: "Avancerat"},
        {key: ["ser02", "s2fodnr"], title: "Personnummer", type: "text", advanced: "Avancerat"},
        {key: ["ser00", "s0kstns"], title: "Avdelning", type: "text", advanced: "Avancerat"},
        {key: ["ser00", "s0aukt"], type: "select", options: ["09", "59", "07"], title: "Nivå"},
        {key: ["ser00", "s0upddat"], title: "Uppdaterad", type: "read"},
        {key: ["ser00", "s0sign"], title: "signatur", type: "read"}]

    return (
        <ItemTable data={data} fields={fields}/>
    );
}
