// src/pages/ProductPage.jsx

import React, {useMemo} from 'react';
import Drawer from '../nav/Drawer';
import PlaceholderPage from '../stackPages/PlaceholderPage';

export default function Settings() {

    const temp = <PlaceholderPage/>
    const items = useMemo(() => [
        [
          { title: "User Management" },
          { title: "Role Permissions", page: temp },
          { title: "Employee Profiles", page: temp },
          { title: "Access Logs", page: temp },
          { title: "Audit Trails", page: temp },
        ],
        [
          { title: "Inventory Control"},
          { title: "Product Listings", page: temp },
          { title: "Supplier Management", page: temp },
          { title: "Stock Levels", page: temp },
          { title: "Reorder Points", page: temp },
          { title: "Warehouse Locations", page: temp },
        ],
        [
          { title: "Sales Reports" },
          { title: "Daily Sales", page: temp },
          { title: "Monthly Performance", page: temp },
          { title: "Sales Forecasting", page: temp },
          { title: "Top Products", page: temp },
        ],
        [
          { title: "Payment Settings" },
          { title: "Tax Configuration", page: temp },
          { title: "Discount Rules", page: temp },
          { title: "Currency Management", page: temp },
        ],
      ], []);
    return (
        <Drawer routes={items}/>
    );
}

