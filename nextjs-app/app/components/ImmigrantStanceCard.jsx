'use client';

import React from 'react';

function ImmigrantStanceCard({ data }) {
  const immigrantFor = data.filter(r => r.identifies_as_immigrant === 'Yes' && r.stance === 'For').length;
  const immigrantAgainst = data.filter(r => r.identifies_as_immigrant === 'Yes' && r.stance === 'Against').length;
  const totalImmigrants = immigrantFor + immigrantAgainst;
  
  return (
    <div className="stats-card" style={{ borderLeft: '4px solid #00BCD4' }}>
      <div className="stats-icon" style={{ backgroundColor: '#E0F7FA' }}>
        <span style={{ fontSize: '2rem' }}>👥</span>
      </div>
      <div className="stats-content">
        <h3 className="stats-title">Self-Identified Immigrants</h3>
        <div className="stats-value" style={{ fontSize: '1.8rem', color: '#00BCD4' }}>
          {totalImmigrants}
        </div>
        <div className="stats-details">
          <div className="immigrant-stance-breakdown">
            <div className="immigrant-stat">
              <span className="for-stat">✅ For: {immigrantFor}</span>
              <span className="percentage">({totalImmigrants > 0 ? ((immigrantFor / totalImmigrants) * 100).toFixed(1) : 0}%)</span>
            </div>
            <div className="immigrant-stat">
              <span className="against-stat">❌ Against: {immigrantAgainst}</span>
              <span className="percentage">({totalImmigrants > 0 ? ((immigrantAgainst / totalImmigrants) * 100).toFixed(1) : 0}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImmigrantStanceCard;
