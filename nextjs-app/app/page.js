'use client';

import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Database, XCircle, CheckCircle2, BarChart3, TrendingUp, Map } from 'lucide-react';
import StatsCard from './components/StatsCard';
import LanguageStatsCard from './components/LanguageStatsCard';
import LanguageStanceCard from './components/LanguageStanceCard';
import StanceBarChart from './components/StanceBarChart';
import TimelineChart from './components/TimelineChart';
import NetherlandsMap from './components/NetherlandsMap';
import './globals.css';

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    against: 0,
    for: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Fetching data from API...');
      
      const response = await fetch('/api/reactions');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data');
      }
      
      console.log('Loaded', result.data.length, 'records');
      setData(result.data);
      calculateStats(result.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const calculateStats = (reactions) => {
    const total = reactions.length;
    const against = reactions.filter(r => r.stance === 'Against').length;
    const forCount = reactions.filter(r => r.stance === 'For').length;
    
    setStats({ total, against, for: forCount });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <h2 style={{ color: 'white' }}>❌ Error Loading Data</h2>
        <p style={{ color: 'white' }}>{error}</p>
        <button 
          onClick={fetchData}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="loading-container">
        <h2 style={{ color: 'white' }}>📊 No Data Available</h2>
        <p style={{ color: 'white' }}>No data was returned from the API.</p>
        <button 
          onClick={fetchData}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Naturalization Reactions Dashboard - Netherlands</h1>
        <p>
          Analysis of public opinions on naturalization term extension as seen here: 
          <a href="https://internetconsultatie.nl/naturalisatietermijn/b1" target="_blank" rel="noopener noreferrer">
            Internet Consultatie
          </a>
          Source code of this project: 
          <a href="https://github.com/darshxm/naturalization_reactions.git" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          {' | '}
          <a href="/privacy" style={{ color: '#fff', textDecoration: 'underline' }}>
            Privacy Policy
          </a>
        </p>
      </header>

      <div className="stats-grid">
        <StatsCard 
          title="Total Opinions" 
          value={stats.total} 
          icon={Database}
          color="#4CAF50"
          gradient="linear-gradient(135deg, #ffffff 0%, #f0f9f0 100%)"
        />
        <StatsCard 
          title="Against" 
          value={stats.against} 
          percentage={(stats.against / stats.total * 100).toFixed(1)}
          icon={XCircle}
          color="#f44336"
          gradient="linear-gradient(135deg, #ffffff 0%, #fff0f0 100%)"
        />
        <StatsCard 
          title="For" 
          value={stats.for} 
          percentage={(stats.for / stats.total * 100).toFixed(1)}
          icon={CheckCircle2}
          color="#2196F3"
          gradient="linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)"
        />
      </div>

      <div className="stats-grid" style={{ marginTop: '30px' }}>
        <LanguageStatsCard data={data} />
        <LanguageStanceCard data={data} />
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h2>
            <BarChart3 size={24} style={{ marginRight: '10px', display: 'inline-block', verticalAlign: 'middle' }} />
            Stance Distribution
          </h2>
          <StanceBarChart data={data} />
        </div>

        <div className="chart-container">
          <h2>
            <TrendingUp size={24} style={{ marginRight: '10px', display: 'inline-block', verticalAlign: 'middle' }} />
            Opinions Over Time
          </h2>
          <TimelineChart data={data} />
        </div>
      </div>

      <div className="map-container">
        <h2>
          <Map size={24} style={{ marginRight: '10px', display: 'inline-block', verticalAlign: 'middle' }} />
          Geographic Distribution
        </h2>
        <NetherlandsMap data={data} />
      </div>
      
      <Analytics />
    </div>
  );
}
