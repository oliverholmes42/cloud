import Drawer from "../nav/Drawer";
import PlaceholderPage from "../stackPages/PlaceholderPage";

export default function HardWarePage(){
    const temp = <PlaceholderPage/>
    const items = [
        [
            {title: "Kassor"},
            {title: "Kassor", page: temp},
            {title: "Terminaler", page: temp},
            {title: "Kvittoskrivare", page: temp}
        ],[
            {title: "Bongar"},
            {title: "Bongskärmar", page: temp},
            {title: "Bongskrivare", page: temp}
        ]
    ]

    return(
        <Drawer routes={items}/>
    )
}