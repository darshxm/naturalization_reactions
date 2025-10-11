'use client';

import React from 'react';
import { Languages, Globe2 } from 'lucide-react';

function LanguageStatsCard({ data }) {
  const dutchCount = data.filter(r => r.language === 'Dutch').length;
  const englishCount = data.filter(r => r.language === 'English').length;
  const otherCount = data.filter(r => r.language === 'Other').length;
  
  const total = data.length;
  
  return (
    <div className="stats-card" style={{ 
      borderLeft: '4px solid #FF9800',
      background: 'linear-gradient(135deg, #ffffff 0%, #fff8f0 100%)'
    }}>
      <div className="stats-icon" style={{ 
        backgroundColor: '#FFF3E0',
        color: '#FF9800'
      }}>
        <Languages size={32} strokeWidth={2} />
      </div>
      <div className="stats-content">
        <h3 className="stats-title">Opinion Language Breakdown</h3>
        <div className="stats-details">
          <div className="language-stat">
            <span className="language-label">
              <Globe2 size={16} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />
              Dutch:
            </span>
            <span className="language-value">{dutchCount} ({((dutchCount / total) * 100).toFixed(1)}%)</span>
          </div>
          <div className="language-stat">
            <span className="language-label">
              <Globe2 size={16} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />
              English:
            </span>
            <span className="language-value">{englishCount} ({((englishCount / total) * 100).toFixed(1)}%)</span>
          </div>
          {otherCount > 0 && (
            <div className="language-stat">
              <span className="language-label">
                <Globe2 size={16} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />
                Other:
              </span>
              <span className="language-value">{otherCount} ({((otherCount / total) * 100).toFixed(1)}%)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LanguageStatsCard;
