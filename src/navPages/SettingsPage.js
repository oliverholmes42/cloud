// src/pages/ProductPage.jsx

import React, {useMemo} from 'react';
import Categories from '../stackPages/articles/Categories';
import Drawer from '../nav/Drawer';

export default function Settings() {
    const items = useMemo(() => [
        [
          { title: "User Management" },
          { title: "Role Permissions", page: <Categories /> },
          { title: "Employee Profiles", page: <Categories /> },
          { title: "Access Logs", page: <Categories /> },
          { title: "Audit Trails", page: <Categories /> },
        ],
        [
          { title: "Inventory Control"},
          { title: "Product Listings", page: <Categories /> },
          { title: "Supplier Management", page: <Categories /> },
          { title: "Stock Levels", page: <Categories /> },
          { title: "Reorder Points", page: <Categories /> },
          { title: "Warehouse Locations", page: <Categories /> },
        ],
        [
          { title: "Sales Reports" },
          { title: "Daily Sales", page: <Categories /> },
          { title: "Monthly Performance", page: <Categories /> },
          { title: "Sales Forecasting", page: <Categories /> },
          { title: "Top Products", page: <Categories /> },
        ],
        [
          { title: "Payment Settings" },
          { title: "Tax Configuration", page: <Categories /> },
          { title: "Discount Rules", page: <Categories /> },
          { title: "Currency Management", page: <Categories /> },
        ],
      ], []);
    return (
        <Drawer routes={items}/>
    );
}

