'use client';

import React from 'react';

const StatsCard = ({ title, value, percentage, icon: Icon, color, gradient }) => {
  return (
    <div className="stats-card" style={{ 
      borderLeftColor: color,
      background: gradient || 'white'
    }}>
      <div className="stats-icon" style={{ 
        backgroundColor: color + '20',
        color: color
      }}>
        {Icon && <Icon size={32} strokeWidth={2} />}
      </div>
      <div className="stats-content">
        <h3>{title}</h3>
        <div className="stats-value">{value.toLocaleString()}</div>
        {percentage && (
          <div className="stats-percentage" style={{ color }}>
            {percentage}%
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
