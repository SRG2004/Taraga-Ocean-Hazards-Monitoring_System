
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './InteractiveMap.css';
import { hazardReportService } from '../services/hazardReportService';
import { socialMediaService } from '../services/socialMediaService';


// Fix for default markers in react-leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
});


// Custom icons for different hazard types
const createCustomIcon = (color, type) => {
  const iconHtml = `
    <div class="custom-marker" style="background-color: ${color};">
      <div class="marker-content">${getHazardIcon(type)}</div>
    </div>
  `;
  
  const svgContent = `
    <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 15 15 25 15 25s15-10 15-25C30 6.7 23.3 0 15 0z" fill="${color}"/>
      <circle cx="15" cy="15" r="8" fill="white"/>
      <text x="15" y="19" text-anchor="middle" font-size="10" fill="${color}">!</text>
    </svg>
  `.trim();
  
  // Use window.btoa with error handling for non-Latin1 characters
  let encodedSvg;
  try {
    encodedSvg = window.btoa(unescape(encodeURIComponent(svgContent)));
  } catch (e) {
    // Fallback for encoding issues
    encodedSvg = window.btoa(svgContent.replace(/[^\x00-\x7F]/g, "!"));
  }
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${encodedSvg}`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40]
  });
};

const getHazardIcon = (type) => {
  const icons = {
    tsunami: '🌊',
    cyclone: '🌀',
    storm: '⛈️',
    flood: '🌊',
    high_waves: '🌊',
    strong_currents: '🌊',
    coastal_erosion: '🏖️',
    default: '⚠️'
  };
  return icons[type] || icons.default;
};

const getHazardColor = (severity) => {
  const colors = {
    critical: '#dc2626',
    high: '#ea580c',
    medium: '#d97706',
    low: '#16a34a',
    default: '#6b7280'
  };
  return colors[severity] || colors.default;
};

// Component to update map view
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  
  return null;
};

const InteractiveMap = ({
  reports: propReports = [],
  alerts: propAlerts = [],
  onReportClick,
  onMapClick,
  showHeatmap = true,
  center = [13.0827, 80.2707], // Chennai coordinates
  zoom = 8,
  height = '500px',
  enableRealTime = true
}) => {
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [selectedLayers, setSelectedLayers] = useState({
    reports: true,
    alerts: true,
    heatmap: showHeatmap
  });
  const [reports, setReports] = useState(propReports);
  const [alerts, setAlerts] = useState(propAlerts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Synthetic data state
  const [syntheticReports, setSyntheticReports] = useState([]);
  const [syntheticHotspots, setSyntheticHotspots] = useState([]);
  const [showSyntheticData, setShowSyntheticData] = useState(true);
  // Load reports from API
  const loadReports = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedReports = await hazardReportService.getReports(filters);
      setReports(fetchedReports);
    } catch (err) {
      console.error('Error loading reports:', err);
      setError('Failed to load hazard reports');
      // Fallback to prop reports if available
      if (propReports.length > 0) {
        setReports(propReports);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load nearby reports based on current map center
  const loadNearbyReports = async (lat, lng, radius = 50) => {
    try {
      const nearbyReports = await hazardReportService.getReportsByLocation(lat, lng, radius);
      setReports(nearbyReports);
    } catch (err) {
      console.error('Error loading nearby reports:', err);
    }
  };

  // Set up real-time updates
  useEffect(() => {
    if (enableRealTime) {
      const unsubscribe = hazardReportService.subscribeToReports((updatedReports) => {
        setReports(updatedReports);
      });

      return unsubscribe;
    }
  }, [enableRealTime]);

  // Load initial data
  useEffect(() => {
    if (propReports.length === 0) {
      loadReports();
    } else {
      setReports(propReports);
    }
  }, [propReports]);

  // Update alerts when prop changes
  useEffect(() => {
    setAlerts(propAlerts);
  }, [propAlerts]);

  // Load initial synthetic reports and generate hotspots
  useEffect(() => {
    const loadSyntheticReports = async () => {
      try {
        const syntheticData = await socialMediaService.syntheticReports.getReports();
        setSyntheticReports(syntheticData);
        generateSyntheticHotspots(syntheticData);
      } catch (error) {
        console.error('Error loading synthetic reports:', error);
      }
    };

    loadSyntheticReports();
  }, []);

  // Handle synthetic reports
  const handleSyntheticReports = (reports) => {
    setSyntheticReports(prev => [...reports, ...prev].slice(0, 100)); // Keep last 100
    generateSyntheticHotspots([...syntheticReports, ...reports]);
  };

  // Generate hotspots from synthetic reports
  const generateSyntheticHotspots = (reports) => {
    const hotspots = [];
    const locationGroups = {};

    // Group reports by proximity (within ~50km)
    reports.forEach(report => {
      if (report.location && report.location.lat && report.location.lng) {
        const key = `${Math.round(report.location.lat * 10) / 10}_${Math.round(report.location.lng * 10) / 10}`;
        if (!locationGroups[key]) {
          locationGroups[key] = [];
        }
        locationGroups[key].push(report);
      }
    });

    // Create hotspots from grouped locations
    Object.values(locationGroups).forEach(group => {
      if (group.length >= 2) { // At least 2 reports to form a hotspot
        const avgLat = group.reduce((sum, r) => sum + r.location.lat, 0) / group.length;
        const avgLng = group.reduce((sum, r) => sum + r.location.lng, 0) / group.length;

        const criticalCount = group.filter(r => r.severity === 'critical').length;
        const highCount = group.filter(r => r.severity === 'high').length;
        const negativeCount = group.filter(r => r.sentiment?.label === 'negative').length;

        let intensity = 'low';
        if (criticalCount > 0 || highCount >= 2) intensity = 'high';
        else if (highCount > 0 || negativeCount >= 3) intensity = 'medium';

        hotspots.push({
          id: `synthetic_hotspot_${Math.random().toString(36).substr(2, 9)}`,
          center: [avgLat, avgLng],
          intensity,
          reportCount: group.length,
          radius: Math.min(50000, group.length * 15000), // Max 50km radius
          reports: group.map(r => r.id),
          dominantTypes: [...new Set(group.map(r => r.hazardType))],
          lastUpdated: new Date().toISOString(),
          isSynthetic: true
        });
      }
    });

    setSyntheticHotspots(hotspots);
  };

  // Listen for synthetic reports
  useEffect(() => {
    const handleNewSyntheticReport = (report) => {
      handleSyntheticReports([report]);
    };

    // Listen for socket events if available
    if (window.socket) {
      window.socket.on('synthetic-social-media-post', handleNewSyntheticReport);
      window.socket.on('synthetic-social-media-posts', handleSyntheticReports);
    }

    return () => {
      if (window.socket) {
        window.socket.off('synthetic-social-media-post', handleNewSyntheticReport);
        window.socket.off('synthetic-social-media-posts', handleSyntheticReports);
      }
    };
  }, [syntheticReports]);



  const handleLayerToggle = (layer) => {
    setSelectedLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const handleLocationSearch = (location) => {
    // Simple location search - in a real app, use geocoding service
    const locations = {
      'chennai': [13.0827, 80.2707],
      'mumbai': [19.0760, 72.8777],
      'kochi': [9.9312, 76.2673],
      'visakhapatnam': [17.6868, 83.2185],
      'goa': [15.2993, 74.1240]
    };
    
    const coords = locations[location.toLowerCase()];
    if (coords) {
      setMapCenter(coords);
      setMapZoom(10);
    }
  };

  return (
    <div className="interactive-map-container">
      {/* Map Controls */}
      <div className="map-controls">
        <div className="layer-controls">
          <h4>Map Layers</h4>
          <label>
            <input
              type="checkbox"
              checked={selectedLayers.reports}
              onChange={() => handleLayerToggle('reports')}
            />
            Hazard Reports
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedLayers.alerts}
              onChange={() => handleLayerToggle('alerts')}
            />
            Alert Zones
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedLayers.heatmap}
              onChange={() => handleLayerToggle('heatmap')}
            />
            Density Heatmap
          </label>


          {/* Synthetic Data Controls */}
          <div className="synthetic-controls">
            <h5>Synthetic Data</h5>
            <label>
              <input
                type="checkbox"
                checked={showSyntheticData}
                onChange={() => setShowSyntheticData(!showSyntheticData)}
              />
              Show Synthetic Hotspots
            </label>
            <div className="synthetic-stats">
              <small>Synthetic Reports: {syntheticReports.length}</small>
              <small>Synthetic Hotspots: {syntheticHotspots.length}</small>
            </div>
          </div>

        </div>
        
        <div className="location-search">
          <select 
            onChange={(e) => handleLocationSearch(e.target.value)}
            defaultValue=""
          >
            <option value="">Quick Jump To...</option>
            <option value="chennai">Chennai</option>
            <option value="mumbai">Mumbai</option>
            <option value="kochi">Kochi</option>
            <option value="visakhapatnam">Visakhapatnam</option>
            <option value="goa">Goa</option>
          </select>
        </div>
      </div>

      {/* Map Legend */}
      <div className="map-legend">
        <h4>Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-marker critical"></div>
            <span>Critical Hazard</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker high"></div>
            <span>High Risk</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker medium"></div>
            <span>Medium Risk</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker low"></div>
            <span>Low Risk</span>
          </div>
        </div>
      </div>

      {/* Main Map */}
      <div className="map-wrapper" style={{ height }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ width: '100%', height: '100%' }}
          onClick={onMapClick}
        >
          <MapUpdater center={mapCenter} zoom={mapZoom} />
          
          {/* Base tile layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Hazard Reports */}
          {selectedLayers.reports && reports.filter(report => report.coordinates && report.coordinates.lat && report.coordinates.lng).map((report) => (
            <Marker
              key={report.id}
              position={[report.coordinates.lat, report.coordinates.lng]}
              icon={createCustomIcon(getHazardColor(report.severity), report.type)}
              eventHandlers={{
                click: () => onReportClick && onReportClick(report)
              }}
            >
              <Popup>
                <div className="map-popup">
                  <h4>{report.title}</h4>
                  <p><strong>Type:</strong> {report.type.replace('_', ' ')}</p>
                  <p><strong>Severity:</strong> {report.severity}</p>
                  <p><strong>Status:</strong> {report.status}</p>
                  <p><strong>Time:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                  {report.description && (
                    <p><strong>Details:</strong> {report.description}</p>
                  )}
                  {report.userInfo && (
                    <p><strong>Reported by:</strong> {report.userInfo.name}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Alert Zones */}
          {selectedLayers.alerts && alerts.filter(alert => alert.coordinates && alert.coordinates.lat && alert.coordinates.lng).map((alert) => (
            <Circle
              key={alert.id}
              center={[alert.coordinates.lat, alert.coordinates.lng]}
              radius={alert.radius}
              fillColor={getHazardColor(alert.severity)}
              fillOpacity={0.3}
              color={getHazardColor(alert.severity)}
              weight={2}
            >
              <Popup>
                <div className="map-popup">
                  <h4>Alert Zone</h4>
                  <p><strong>Type:</strong> {alert.type}</p>
                  <p><strong>Message:</strong> {alert.message}</p>
                  <p><strong>Radius:</strong> {(alert.radius / 1000).toFixed(1)} km</p>
                </div>
              </Popup>
            </Circle>
          ))}


          {/* Synthetic Hotspots */}
          {showSyntheticData && syntheticHotspots.map((hotspot) => (
            <Circle
              key={hotspot.id}
              center={hotspot.center}
              radius={hotspot.radius}
              fillColor={getHazardColor(hotspot.intensity)}
              fillOpacity={0.4}
              color={getHazardColor(hotspot.intensity)}
              weight={3}
              dashArray="10, 10"
            >
              <Popup>
                <div className="map-popup synthetic-popup">
                  <h4>🤖 Synthetic Hotspot</h4>
                  <p><strong>Intensity:</strong> {hotspot.intensity}</p>
                  <p><strong>Reports:</strong> {hotspot.reportCount}</p>
                  <p><strong>Types:</strong> {hotspot.dominantTypes.join(', ')}</p>
                  <p><strong>Radius:</strong> {(hotspot.radius / 1000).toFixed(1)} km</p>
                  <p><strong>Updated:</strong> {new Date(hotspot.lastUpdated).toLocaleTimeString()}</p>
                  <small className="synthetic-note">Generated from synthetic social media reports</small>
                </div>
              </Popup>
            </Circle>
          ))}

        </MapContainer>
      </div>

      {/* Map Statistics */}
      <div className="map-stats">
        <div className="stat-item">
          <span className="stat-value">{reports.length}</span>
          <span className="stat-label">Active Reports</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{alerts.length}</span>
          <span className="stat-label">Alert Zones</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {reports.filter(r => r.severity === 'critical' || r.severity === 'high').length}
          </span>
          <span className="stat-label">High Priority</span>
        </div>


        {/* Synthetic Data Stats */}
        {showSyntheticData && (
          <>
            <div className="stat-item synthetic">
              <span className="stat-value">{syntheticReports.length}</span>
              <span className="stat-label">Synthetic Reports</span>
            </div>
            <div className="stat-item synthetic">
              <span className="stat-value">{syntheticHotspots.length}</span>
              <span className="stat-label">Synthetic Hotspots</span>
            </div>
          </>
        )}


        {loading && (
          <div className="stat-item">
            <span className="stat-value">⟳</span>
            <span className="stat-label">Loading...</span>
          </div>
        )}
        {error && (
          <div className="stat-item error">
            <span className="stat-value">⚠️</span>
            <span className="stat-label">Error</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;