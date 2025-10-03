import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, percentage, icon, color }) => {
  return (
    <div className="stats-card" style={{ borderLeftColor: color }}>
      <div className="stats-icon" style={{ backgroundColor: color }}>
        {icon}
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
