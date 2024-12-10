import Drawer from "../nav/Drawer";
import RecieptsPage from "../stackPages/reports/RecieptsPage";
import PlaceholderPage from "../stackPages/PlaceholderPage";
import TransaktionPage from "../stackPages/reports/TransaktionPage";

export default function ReportsPage(){

    const routes = [[
        {title: "Kvitton", page: <RecieptsPage/>},
        {title: "Transaktioner", page: <TransaktionPage/>}
    ]]
    return(
        <Drawer routes={routes}/>
    )
}
