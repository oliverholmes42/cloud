import Drawer from "../nav/Drawer";
import RecieptsPage from "../stackPages/reports/RecieptsPage";

export default function ReportsPage(){

    const routes = [[
        {title: "Kvitton", page: <RecieptsPage/>}
    ]]
    return(
        <Drawer routes={routes}/>
    )
}
