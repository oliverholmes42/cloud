import React from 'react';
import styles from './Chart.module.css';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

export default function Chart({ data, dataKey, title, xKey, referenceLine }) {
  return (
    <div className={`block ${styles.chart}`}>
      <h2>{title}</h2>
      <AreaChart
        width={400} // Fixed width
        height={200} // Fixed height
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />

        <Area
          type="monotone"
          dataKey={dataKey}
          fill="var(--accent)"
          stroke="var(--black)"
          fillOpacity={0.8}
        />

        {referenceLine && (
          <ReferenceLine
            x={referenceLine.value}
            stroke={referenceLine.color || 'red'}
            label={referenceLine.label || ''}
            strokeDasharray="3 3"
          />
        )}
      </AreaChart>
    </div>
  );
}
