import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TimelineChart = ({ data }) => {
  const timelineData = useMemo(() => {
    // Parse dates and group by date
    const dateMap = new Map();
    
    data.forEach(item => {
      if (!item.list_date_time) return;
      
      // Extract date from "DD month YYYY (HH:MM)" format
      const dateMatch = item.list_date_time.match(/(\d{2})\s+(\w+)\s+(\d{4})/);
      if (!dateMatch) return;
      
      const [, day, monthName, year] = dateMatch;
      const monthMap = {
        'januari': '01', 'februari': '02', 'maart': '03', 'april': '04',
        'mei': '05', 'juni': '06', 'juli': '07', 'augustus': '08',
        'september': '09', 'oktober': '10', 'november': '11', 'december': '12'
      };
      
      const month = monthMap[monthName.toLowerCase()] || '01';
      const dateKey = `${year}-${month}-${day}`;
      
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, { date: dateKey, Against: 0, For: 0, Neutral: 0 });
      }
      
      const entry = dateMap.get(dateKey);
      if (item.stance === 'Against') entry.Against++;
      else if (item.stance === 'For') entry.For++;
      else entry.Neutral++;
    });
    
    // Convert to array and sort by date
    const sortedData = Array.from(dateMap.values())
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Calculate cumulative counts
    let cumulativeAgainst = 0;
    let cumulativeFor = 0;
    let cumulativeNeutral = 0;
    
    return sortedData.map(item => {
      cumulativeAgainst += item.Against;
      cumulativeFor += item.For;
      cumulativeNeutral += item.Neutral;
      
      return {
        date: item.date,
        Against: cumulativeAgainst,
        For: cumulativeFor,
        Neutral: cumulativeNeutral,
        displayDate: item.date.split('-').reverse().join('/')
      };
    });
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '2px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '8px' }}>
            {payload[0].payload.displayDate}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '4px 0', color: entry.color }}>
              {entry.name}: <strong>{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="displayDate" 
          tick={{ fill: '#666', fontSize: 12 }}
          axisLine={{ stroke: '#ddd' }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          tick={{ fill: '#666', fontSize: 14 }}
          axisLine={{ stroke: '#ddd' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="line"
        />
        <Line 
          type="monotone" 
          dataKey="Against" 
          stroke="#f44336" 
          strokeWidth={3}
          dot={{ fill: '#f44336', r: 4 }}
          activeDot={{ r: 6 }}
          animationDuration={1500}
        />
        <Line 
          type="monotone" 
          dataKey="For" 
          stroke="#2196F3" 
          strokeWidth={3}
          dot={{ fill: '#2196F3', r: 4 }}
          activeDot={{ r: 6 }}
          animationDuration={1500}
        />
        <Line 
          type="monotone" 
          dataKey="Neutral" 
          stroke="#FFC107" 
          strokeWidth={3}
          dot={{ fill: '#FFC107', r: 4 }}
          activeDot={{ r: 6 }}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimelineChart;
