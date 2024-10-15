// src/pages/ProductPage.jsx

import React, {useMemo} from 'react';
import Products from '../stackPages/articles/Products';
import Categories from '../stackPages/articles/Categories';
import Drawer from '../nav/Drawer';

export default function ProductPage() {
    const items = useMemo(() => [[{title: "Artiklar"},

        { title: "Produkter", page: <Products /> },
        { title: "Varugrupper", page: <Categories /> }
    ]], []);
    return (
        <Drawer routes={items}/>
    );
}

