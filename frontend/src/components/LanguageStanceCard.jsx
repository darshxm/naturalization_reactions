import React from 'react';
import './StatsCard.css';

function LanguageStanceCard({ data }) {
  const dutchFor = data.filter(r => r.language === 'Dutch' && r.stance === 'For').length;
  const dutchAgainst = data.filter(r => r.language === 'Dutch' && r.stance === 'Against').length;
  const englishFor = data.filter(r => r.language === 'English' && r.stance === 'For').length;
  const englishAgainst = data.filter(r => r.language === 'English' && r.stance === 'Against').length;
  
  return (
    <div className="stats-card" style={{ borderLeft: '4px solid #9C27B0' }}>
      <div className="stats-icon" style={{ backgroundColor: '#F3E5F5' }}>
        <span style={{ fontSize: '2rem' }}>📊</span>
      </div>
      <div className="stats-content">
        <h3 className="stats-title">Language by Stance</h3>
        <div className="stats-details">
          <div className="language-stance-group">
            <strong>🇳🇱 Dutch:</strong>
            <div className="stance-breakdown">
              <span className="for-stat">✅ For: {dutchFor}</span>
              <span className="against-stat">❌ Against: {dutchAgainst}</span>
            </div>
          </div>
          <div className="language-stance-group">
            <strong>🇬🇧 English:</strong>
            <div className="stance-breakdown">
              <span className="for-stat">✅ For: {englishFor}</span>
              <span className="against-stat">❌ Against: {englishAgainst}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LanguageStanceCard;
