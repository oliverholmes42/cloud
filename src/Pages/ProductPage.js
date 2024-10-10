// src/pages/ProductPage.jsx

import React from 'react';
import products from '../data/products.json';

export default function ProductPage() {
    return (
        <>
            <h1>Produkter</h1>

            <div className="block">
                <table>
                    <thead>
                        <tr>
                            <th>Namn</th>
                            <th>Kategori</th>
                            <th>Moms</th>
                            <th>Pris</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{(product.tax_rate * 100).toFixed(0)}%</td>
                                <td>{formatPrice(product.selling_price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

// Helper function to format price based on locale
function formatPrice(price) {
    return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(price);
}
