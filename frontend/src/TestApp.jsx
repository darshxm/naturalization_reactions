import React, { useState, useEffect } from 'react';

function TestApp() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Starting fetch...');
    fetch('/api/reactions')
      .then(response => {
        console.log('Response status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('Data received:', data.length, 'records');
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{color: 'white', padding: '50px'}}>Loading...</div>;
  if (error) return <div style={{color: 'white', padding: '50px'}}>Error: {error}</div>;
  if (!data) return <div style={{color: 'white', padding: '50px'}}>No data</div>;

  return (
    <div style={{color: 'white', padding: '50px'}}>
      <h1>Test App</h1>
      <p>Data loaded: {data.length} records</p>
      <pre>{JSON.stringify(data[0], null, 2).substring(0, 500)}</pre>
    </div>
  );
}

export default TestApp;
