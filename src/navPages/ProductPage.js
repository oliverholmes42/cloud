// src/pages/ProductPage.jsx

import React, {useMemo} from 'react';
import products from '../data/products.json';
import { useStack } from '../StackContext';
import Products from '../stackPages/articles/Products';
import Categories from '../stackPages/articles/Categories';
import Drawer from '../nav/Drawer';

export default function ProductPage() {
    const items = useMemo(() => [[
        { title: "Produkter", page: <Products /> },
        { title: "Categories", page: <Categories /> }
    ]], []);
    return (
        <Drawer routes={items}/>
    );
}

