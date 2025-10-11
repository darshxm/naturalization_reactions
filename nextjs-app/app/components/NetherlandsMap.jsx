'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import map components to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const Tooltip = dynamic(
  () => import('react-leaflet').then((mod) => mod.Tooltip),
  { ssr: false }
);

const cityCoordinates = {
  'amsterdam': [52.3676, 4.9041],
  'rotterdam': [51.9244, 4.4777],
  'den haag': [52.0705, 4.3007],
  'utrecht': [52.0907, 5.1214],
  'eindhoven': [51.4416, 5.4697],
  'tilburg': [51.5555, 5.0913],
  'groningen': [53.2194, 6.5665],
  'almere': [52.3508, 5.2647],
  'breda': [51.5719, 4.7683],
  'nijmegen': [51.8126, 5.8372],
  'haarlem': [52.3874, 4.6462],
  'arnhem': [51.9851, 5.8987],
  'enschede': [52.2215, 6.8937],
  'apeldoorn': [52.2112, 5.9699],
  'leiden': [52.1601, 4.4970],
  'maastricht': [50.8514, 5.6909],
  'dordrecht': [51.8133, 4.6901],
  'zoetermeer': [52.0576, 4.4932],
  'zwolle': [52.5168, 6.0830],
  'delft': [52.0116, 4.3571],
  'alkmaar': [52.6325, 4.7494],
  'amersfoort': [52.1561, 5.3878],
  'hilversum': [52.2232, 5.1756],
  'hoofddorp': [52.3030, 4.6889],
  'best': [51.5078, 5.3897],
  'nuenen': [51.4703, 5.5503],
  'diemen': [52.3398, 4.9634],
  'helmond': [51.4811, 5.6567],
  'numansdorp': [51.7333, 4.4333],
  'alphen aan den rijn': [52.1281, 4.6573],
  'wijchen': [51.8083, 5.7242],
  'bergen op zoom': [51.4950, 4.2917],
  'overloon': [51.5711, 5.9447],
  'den bosch': [51.6978, 5.3037],
  's-hertogenbosch': [51.6978, 5.3037]
};

const NetherlandsMap = ({ data }) => {
  const mapData = useMemo(() => {
    const locationMap = new Map();
    
    data.forEach(item => {
      if (!item.list_place) return;
      
      const place = item.list_place.toLowerCase().trim();
      const coords = cityCoordinates[place];
      
      if (coords) {
        if (!locationMap.has(place)) {
          locationMap.set(place, {
            name: item.list_place,
            coords,
            Against: 0,
            For: 0,
            Neutral: 0,
            total: 0
          });
        }
        
        const location = locationMap.get(place);
        if (item.stance === 'Against') location.Against++;
        else if (item.stance === 'For') location.For++;
        else location.Neutral++;
        location.total++;
      }
    });
    
    return Array.from(locationMap.values());
  }, [data]);

  const getMarkerColor = (location) => {
    if (location.Against > location.For) return '#f44336';
    if (location.For > location.Against) return '#2196F3';
    return '#FFC107';
  };

  const getMarkerSize = (total) => {
    if (total > 20) return 20;
    if (total > 10) return 15;
    if (total > 5) return 12;
    return 8;
  };

  return (
    <div style={{ height: '450px', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer 
        center={[52.2129, 5.2793]} 
        zoom={7} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {mapData.map((location, index) => (
          <CircleMarker
            key={index}
            center={location.coords}
            radius={getMarkerSize(location.total)}
            fillColor={getMarkerColor(location)}
            color="white"
            weight={2}
            opacity={0.9}
            fillOpacity={0.7}
          >
            <Tooltip>
              <strong>{location.name}</strong>
            </Tooltip>
            <Popup>
              <div style={{ padding: '8px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{location.name}</h3>
                <p style={{ margin: '4px 0', color: '#f44336' }}>
                  <strong>Against:</strong> {location.Against}
                </p>
                <p style={{ margin: '4px 0', color: '#2196F3' }}>
                  <strong>For:</strong> {location.For}
                </p>
                {location.Neutral > 0 && (
                  <p style={{ margin: '4px 0', color: '#FFC107' }}>
                    <strong>Neutral:</strong> {location.Neutral}
                  </p>
                )}
                <p style={{ margin: '8px 0 0 0', fontWeight: 'bold' }}>
                  Total: {location.total}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default NetherlandsMap;
