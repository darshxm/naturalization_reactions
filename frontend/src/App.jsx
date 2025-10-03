import React, { useState, useEffect } from 'react';
import StatsCard from './components/StatsCard';
import StanceBarChart from './components/StanceBarChart';
import TimelineChart from './components/TimelineChart';
import NetherlandsMap from './components/NetherlandsMap';
import './App.css';

function App() {
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
      
      // Fetch data from Flask API (Vite proxy will forward to localhost:5000)
      const response = await fetch('/api/reactions');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const jsonData = await response.json();
      console.log('Data received from API:', jsonData.length, 'records');
      
      setData(jsonData);
      calculateStats(jsonData);
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
        <p style={{ color: 'white' }}>The CSV file appears to be empty or not loading correctly.</p>
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
        <h1>🇳🇱 Naturalization Reactions Dashboard</h1>
        <p>Real-time analysis of public opinions on naturalization term extension</p>
      </header>

      <div className="stats-grid">
        <StatsCard 
          title="Total Opinions" 
          value={stats.total} 
          icon="📊"
          color="#4CAF50"
        />
        <StatsCard 
          title="Against" 
          value={stats.against} 
          percentage={(stats.against / stats.total * 100).toFixed(1)}
          icon="❌"
          color="#f44336"
        />
        <StatsCard 
          title="For" 
          value={stats.for} 
          percentage={(stats.for / stats.total * 100).toFixed(1)}
          icon="✅"
          color="#2196F3"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h2>📊 Stance Distribution</h2>
          <StanceBarChart data={data} />
        </div>

        <div className="chart-container">
          <h2>📈 Opinions Over Time</h2>
          <TimelineChart data={data} />
        </div>
      </div>

      <div className="map-container">
        <h2>🗺️ Geographic Distribution</h2>
        <NetherlandsMap data={data} />
      </div>
    </div>
  );
}

export default App;
