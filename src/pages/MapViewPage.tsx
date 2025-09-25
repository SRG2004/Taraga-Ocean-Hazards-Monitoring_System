import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import './MapViewPage.css';

const MapViewPage: React.FC = () => {
  const { reports, loadReports } = useApp();
  const [mapData, setMapData] = useState<any>(null);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  useEffect(() => {
    // In a real application, you would use a mapping library like Google Maps or Leaflet.
    // Here, we'll simulate a map with a simple grid.
    if (reports.length > 0) {
      // This is a placeholder for actual map rendering logic.
      const simulatedMap = {
        center: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
        zoom: 8,
        markers: reports.map((report: any) => ({
          position: {
            lat: report.location.latitude + (Math.random() - 0.5) * 0.1,
            lng: report.location.longitude + (Math.random() - 0.5) * 0.1,
          },
          title: report.hazardType,
          description: report.description,
        })),
      };
      setMapData(simulatedMap);
    }
  }, [reports]);

  return (
    <div className="map-view-page">
      <header className="map-header">
        <h1>Live Hazard Map</h1>
        <p>Real-time hazard locations reported by users.</p>
      </header>

      <div className="map-container">
        {mapData ? (
          // This would be a real map component
          <div className="simulated-map">
            <p><strong>Map Center:</strong> {mapData.center.lat.toFixed(4)}, {mapData.center.lng.toFixed(4)}</p>
            <p><strong>Zoom Level:</strong> {mapData.zoom}</p>
            <div className="markers-list">
              <h4>Reported Hazards:</h4>
              <ul>
                {mapData.markers.map((marker: any, index: number) => (
                  <li key={index}>
                    <strong>{marker.title}</strong> at ({marker.position.lat.toFixed(4)}, {marker.position.lng.toFixed(4)}): {marker.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="loading-map">Loading map data...</div>
        )}
      </div>
    </div>
  );
};

export default MapViewPage;
