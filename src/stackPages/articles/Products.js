import React, { useMemo, useState } from 'react';
import data from '../../data/products.json';
import EditTableRow from '../../itemHandling/EditTableRow';

export default function Products() {
  const [selected, setSelected] = useState();
  const fields = useMemo(
    () => [
        { name: 'id', type: 'read' }, // Read-only ID
        { name: 'name', type: 'text' }, // Editable name
        { name: 'category', type: 'select', options: ['Cocktail', 'Beer', 'Wine', 'Spirits', 'Highball', 'Non-Alcoholic', 'Sparkling Wine'] }, // Editable category with options
        { name: 'sku', type: 'text' }, // Editable SKU
        { name: 'cost_price', type: 'number' }, // Editable cost price
        { name: 'selling_price', type: 'number' }, // Editable selling price
        { name: 'tax_rate', type: 'number' }, // Editable tax rate
        { name: 'in_stock', type: 'select', options: ['Yes', 'No'] }, // Editable in_stock as dropdown
        { name: 'alcohol_content', type: 'text' }, // Editable alcohol content as text
        { name: 'serving_size', type: 'text' }, // Editable serving size
        { name: 'created_at', type: 'read' }, // Read-only created_at
        { name: 'updated_at', type: 'read' }, // Read-only updated_at
    ],
    []
  );

  return (
    <>
      <h1>Product List</h1>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            {fields.map((field, index) => (
              <th key={index}>{field.name.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {data.map((item, index) => (
            index === selected ?  <EditTableRow key={item.id} item={item} fields={fields} />:
                    <tr key={item.id} onClick={()=>{setSelected(index)}}>
                      <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.sku}</td>
                        <td>${item.cost_price.toFixed(2)}</td>
                        <td>${item.selling_price.toFixed(2)}</td>
                        <td>{(item.tax_rate * 100).toFixed(0)}%</td>
                        <td>{item.in_stock ? "Yes" : "No"}</td>
                        <td>{item.alcohol_content}</td>
                        <td>{item.serving_size}</td>
                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                        <td>{new Date(item.updated_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
        </tbody>
      </table>
    </>
  );
}
