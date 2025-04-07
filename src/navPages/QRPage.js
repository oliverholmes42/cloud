import PlaceholderPage from "../stackPages/PlaceholderPage";
import Drawer from "../nav/Drawer";
import QRBestäLlningar from "../stackPages/QR/QR-Beställningar";

export default function QRPage() {
    const items = [
        [
            {title: "Beställningar",page: <QRBestäLlningar/>},
            {title: "Rapporter",page: <PlaceholderPage/>}
        ],
        [
            {title: "Produkter",page: <PlaceholderPage/>},
            {title: "Stegval", page: <PlaceholderPage/>},
            {title: "Menyer", page: <PlaceholderPage/>},
        ]
    ]

    return <Drawer routes={items}/>
}