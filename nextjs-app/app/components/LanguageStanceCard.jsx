'use client';

import React from 'react';
import { BarChart3, CheckCircle2, XCircle } from 'lucide-react';

function LanguageStanceCard({ data }) {
  const dutchFor = data.filter(r => r.language === 'Dutch' && r.stance === 'For').length;
  const dutchAgainst = data.filter(r => r.language === 'Dutch' && r.stance === 'Against').length;
  const englishFor = data.filter(r => r.language === 'English' && r.stance === 'For').length;
  const englishAgainst = data.filter(r => r.language === 'English' && r.stance === 'Against').length;
  
  return (
    <div className="stats-card" style={{ 
      borderLeft: '4px solid #9C27B0',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f0fa 100%)'
    }}>
      <div className="stats-icon" style={{ 
        backgroundColor: '#F3E5F5',
        color: '#9C27B0'
      }}>
        <BarChart3 size={32} strokeWidth={2} />
      </div>
      <div className="stats-content">
        <h3 className="stats-title">Language by Stance</h3>
        <div className="stats-details">
          <div className="language-stance-group">
            <strong>Dutch:</strong>
            <div className="stance-breakdown">
              <span className="for-stat">
                <CheckCircle2 size={14} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }} />
                For: {dutchFor}
              </span>
              <span className="against-stat">
                <XCircle size={14} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }} />
                Against: {dutchAgainst}
              </span>
            </div>
          </div>
          <div className="language-stance-group">
            <strong>English:</strong>
            <div className="stance-breakdown">
              <span className="for-stat">
                <CheckCircle2 size={14} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }} />
                For: {englishFor}
              </span>
              <span className="against-stat">
                <XCircle size={14} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }} />
                Against: {englishAgainst}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LanguageStanceCard;
