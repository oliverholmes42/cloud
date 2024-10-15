import Drawer from "../nav/Drawer"
import PlaceholderPage from "../stackPages/PlaceholderPage"

export default function IntegrationPage(){
    const tempPage = <PlaceholderPage/>
    const items = [[
        {title: "Integrationer"},
        {title: "Caspeco", page: tempPage},
        {title: "Fort Knox", page: tempPage},
        {title: "Personalkollen", page: tempPage}

    ]]
    return <Drawer routes={items}/>
}