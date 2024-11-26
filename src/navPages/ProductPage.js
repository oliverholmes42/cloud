// src/pages/ProductPage.jsx

import React, {useMemo} from 'react';
import Products from '../stackPages/articles/Products';
import Categories from '../stackPages/articles/Categories';
import Drawer from '../nav/Drawer';
import TaxCodes from '../stackPages/articles/TaxCodes';
import ProductSteps from '../stackPages/articles/ProductSteps';
import Addons from "../stackPages/articles/Addons";
import Happyhour from "../stackPages/articles/Happyhour";
import Currency from "../stackPages/articles/Currency";
import Pays from "../stackPages/articles/Pays";
import Bongs from "../stackPages/articles/Bongs";


export default function ProductPage() {
    const items = useMemo(() => [
        [
            {title: "Artiklar"},
            {title: "Produkter", page: <Products /> },
            {title: "Stegval", page: <ProductSteps/>},
            {title: "Tillval", page: <Addons/>}
        ]
        ,[
            {title: "Ekonomi"},
            {title: "Varugrupper", page: <Categories /> },
            {title: "Momskoder", page: <TaxCodes/>},
            {title: "Valutor", page: <Currency/>},
            {title: "Betalsätt", page: <Pays/>},
        ],
        [
            {title: "Prisnivåer"},
            {title: "Happy Hour", page: <Happyhour/>}
        ],        [
            {title: "Bongsystem"},
            {title: "Bongkö", page: <Bongs/>}
        ]
        , ],[]);
    return (
        <Drawer routes={items}/>
    );
}

