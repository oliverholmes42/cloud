import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, Cell } from "recharts";
import sales from '../data/sales.json'; // Assuming your sales data is here
import Select from 'react-select/base';
import tickets from '../data/ticketScreens.json'

export default function Dash() {
  const mergedData = sales[0].map((item, index) => ({
    day: item.day,
    sales1: item.sales,  // Last week's sales (always shown)
    sales2: sales[1][index]?.sales || null,  // This week's sales (only shown if present)
    difference: sales[1][index]?.sales != null ? sales[1][index].sales - item.sales : null  // Calculate gain/loss if this week's data exists
  }));
  const [date, setDate] = useState();

 

  const minSales = Math.min(...mergedData.flatMap(item => [item.sales1, item.sales2].filter(val => val !== null)));

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Översikt</h1>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly" }}>
        
        {/* BarChart with both sales sets */}
        <ResponsiveContainer width={300} height={200}>
          <BarChart data={mergedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[minSales, 'auto']} /> {/* Set Y-axis to start from the minimum sales */}
            <Tooltip />
            <Legend />
            <Bar dataKey="sales1" fill="#8884d8" name="Föregående vecka" />
            <Bar dataKey="sales2" fill="#82ca9d" name="Nuvarande" />
          </BarChart>
        </ResponsiveContainer>

        {/* AreaChart with transparency */}
        <ResponsiveContainer width={300} height={200}>
          <AreaChart data={mergedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[minSales, 'auto']} /> {/* Start Y-axis from the minimum sales */}
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="sales1"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
              name="Föregående"
            />
            <Area
              type="monotone"
              dataKey="sales2"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.3}
              name="Nuvarande"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Gain/Loss BarChart */}
        <ResponsiveContainer width={300} height={200}>
          <BarChart data={mergedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[-100, 100]} />
            <Tooltip />
            {/* Bars for gain/loss */}
            <Bar dataKey="difference">
              {
                mergedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.difference > 0 ? "#82ca9d" : "#ff4d4f"} />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
      </div>
    </>
  );
}
