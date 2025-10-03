import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const StanceBarChart = ({ data }) => {
  const stanceCounts = data.reduce((acc, item) => {
    acc[item.stance] = (acc[item.stance] || 0) + 1;
    return acc;
  }, {});

  const chartData = [
    { name: 'Against', count: stanceCounts['Against'] || 0, color: '#f44336' },
    { name: 'For', count: stanceCounts['For'] || 0, color: '#2196F3' },
    { name: 'Neutral', count: stanceCounts['Neutral'] || 0, color: '#FFC107' }
  ].filter(item => item.count > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = chartData.reduce((sum, item) => sum + item.count, 0);
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '2px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: payload[0].payload.color }}>
            {payload[0].payload.name}
          </p>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>
            Count: <strong>{payload[0].value}</strong>
          </p>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>
            Percentage: <strong>{percentage}%</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#666', fontSize: 14 }}
          axisLine={{ stroke: '#ddd' }}
        />
        <YAxis 
          tick={{ fill: '#666', fontSize: 14 }}
          axisLine={{ stroke: '#ddd' }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="circle"
        />
        <Bar 
          dataKey="count" 
          radius={[8, 8, 0, 0]}
          animationDuration={1000}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StanceBarChart;
