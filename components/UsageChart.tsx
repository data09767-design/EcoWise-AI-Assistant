import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { UsageData } from '../types';

interface UsageChartProps {
  data: UsageData[];
}

export const UsageChart: React.FC<UsageChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(113, 128, 150, 0.3)" />
          <XAxis dataKey="name" stroke="#A0AEC0" />
          <YAxis yAxisId="left" stroke="#00F5FF" label={{ value: 'Usage (kWh)', angle: -90, position: 'insideLeft', fill: '#00F5FF' }} />
          <YAxis yAxisId="right" orientation="right" stroke="#FBBF24" label={{ value: 'Carbon (kg CO₂)', angle: -90, position: 'insideRight', fill: '#FBBF24' }} />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: 'rgba(26, 32, 44, 0.8)', 
                backdropFilter: 'blur(5px)',
                border: '1px solid #4A5568',
                borderRadius: '0.5rem',
                color: '#F7FAFC'
            }}
          />
          <Legend wrapperStyle={{color: '#F7FAFC'}}/>
           <defs>
            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#00F5FF" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.7}/>
              <stop offset="95%" stopColor="#FBBF24" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" yAxisId="left" dataKey="usage" name="Usage (kWh)" stroke="#00F5FF" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={3} />
          <Area type="monotone" yAxisId="right" dataKey="carbon" name="Carbon (kg CO₂)" stroke="#FBBF24" fillOpacity={1} fill="url(#colorCarbon)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};