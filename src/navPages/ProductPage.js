// src/pages/ProductPage.jsx

import React, {useMemo} from 'react';
import Products from '../stackPages/articles/Products';
import Categories from '../stackPages/articles/Categories';
import Drawer from '../nav/Drawer';
import TaxCodes from '../stackPages/articles/TaxCodes';
import ProductSteps from '../stackPages/articles/ProductSteps';


export default function ProductPage() {
    const items = useMemo(() => [[{title: "Artiklar"},

        { title: "Produkter", page: <Products /> },
        { title: "Varugrupper", page: <Categories /> },
        {title: "Momskoder", page: <TaxCodes/>},
        {title: "Stegval", page: <ProductSteps/>}
    ]], []);
    return (
        <Drawer routes={items}/>
    );
}

