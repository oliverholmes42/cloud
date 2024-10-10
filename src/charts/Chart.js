import React from 'react';
import styles from './Chart.module.css'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export default function Chart({ data, dataKey, title, xKey, referenceLine }) {
  return (
    <div className={`block ${styles.chart}`}>
      <h2>{title}</h2>
      <ResponsiveContainer width={400} height={200}>
        <AreaChart data={data}>
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
      </ResponsiveContainer>
    </div>
  );
}
