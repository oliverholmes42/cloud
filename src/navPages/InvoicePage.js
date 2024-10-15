import { useMemo } from "react"
import Categories from "../stackPages/articles/Categories"
import Drawer from "../nav/Drawer"

export default function InvoicePage(){
    const items = useMemo(() => [[
        {title: "Fakturor"},
        { title: "Översikt", page: <Categories /> },
      ],
      [
        { title: "Kunder" }, // Group Title
        { title: "Kunder", page: <Categories /> },
        { title: "Statistik", page: <Categories /> },
      ],
      [
        { title: "Frontoffice" }, // Group Title
        { title: "Underlag", page: <Categories /> },
        { title: "Kunder Underlag", page: <Categories /> },
        { title: "Intern Reskontra", page: <Categories /> },
      ],
      [
        { title: "Reskontra" }, // Group Title
        { title: "Reskontra", page: <Categories /> },
        { title: "Påminnelser", page: <Categories /> },
        { title: "Räntehantering", page: <Categories /> },
        { title: "Historik", page: <Categories /> },
      ],
      [
        { title: "Ekonomi" }, // Group Title
        { title: "Rapporter", page: <Categories /> },
        { title: "Listor", page: <Categories /> },
        { title: "Register", page: <Categories /> },
      ],
      [
        { title: "Backoffice" }, // Group Title
        { title: "Företag", page: <Categories /> },
        { title: "Parametrar", page: <Categories /> },
        { title: "Artiklar", page: <Categories /> },
      ],
    ], [])

    return(
        <Drawer routes={items}/>
    )
}