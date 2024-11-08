// src/pages/ProductPage.jsx

import React, {useMemo} from 'react';
import Drawer from '../nav/Drawer';
import PlaceholderPage from '../stackPages/PlaceholderPage';
import UserRoles from '../stackPages/UserRoles';

export default function Settings() {

    const temp = <PlaceholderPage/>
    const items = [
  
        [
          { title: "Användarhantering" },
          { title: "Rättigheter för roller", page: temp },
          { title: "Anställdas profiler", page: <UserRoles/> },
          { title: "Åtkomstloggar", page: temp },
          { title: "Granskningsspår", page: temp },
        ],
        [
          { title: "Lagerkontroll" },
          { title: "Produktlistor", page: temp },
          { title: "Leverantörshantering", page: temp },
          { title: "Lagerstatus", page: temp },
          { title: "Beställningsnivåer", page: temp },
          { title: "Lagerplatser", page: temp },
        ],
        [
          { title: "Försäljningsrapporter" },
          { title: "Daglig försäljning", page: temp },
          { title: "Månatlig prestation", page: temp },
          { title: "Försäljningsprognoser", page: temp },
          { title: "Toppprodukter", page: temp },
        ],
        [
          { title: "Betalningsinställningar" },
          { title: "Skatteinställningar", page: temp },
          { title: "Rabattregler", page: temp },
          { title: "Valutahantering", page: temp },
        ],
            
      ];
    return (
        <Drawer routes={items}/>
    );
}

