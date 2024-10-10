import React from 'react';
import Chart from '../charts/Chart.js'; 
import orders from '../data/orders.json';
import revenue from '../data/revenue.json';
import sales from '../data/sales.json';
import visitors from '../data/visitors.json';

export default function Dash() {
  return (
    <>
    <h1 style={{textAlign: "center"}}>Översikt</h1>
    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-evenly"}}>
      <Chart 
        data={sales} 
        dataKey="sales" 
        xKey="hour" 
        title="Hourly Sales"
        referenceLine={{ value: '12:00', color: 'green' }}
      />
      <Chart
        data={visitors} 
        dataKey="visitors" 
        xKey="day"    // Specify the xKey for daily visitors (e.g., day of the week)
        title="Daily Visitors"
        referenceLine={{ value: 'Monday',  color: 'blue' }}
      />
      <Chart 
        data={revenue} 
        dataKey="revenue" 
        xKey="month"  // Use 'month' or other relevant field
        title="Monthly Revenue"
        referenceLine={{ value: '15',  color: 'orange' }}
      />
      <Chart
        data={orders} 
        dataKey="orders" 
        xKey="week"   // If you have weekly data, use 'week' for the X-axis
        title="Weekly Orders"
        referenceLine={{ value: 'Wednesday',  color: 'purple' }}
      />
      </div>
    </>
    
  );
}
