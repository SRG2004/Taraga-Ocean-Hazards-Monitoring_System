import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { realTimeHazardService, LocationSearchService, type HazardReport, type Hotspot } from '../services/realTimeHazardService';
import { MapPin, Search, Filter, AlertTriangle, Activity } from 'lucide-react';

// Fix for default markers in react-leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
});

// Simple custom icons
const createSimpleIcon = (severity: string) => {
  const colors = {
    critical: '#dc2626',
    high: '#ea580c', 
    medium: '#d97706',
    low: '#16a34a',
    default: '#6b7280'
  };
  
  const color = colors[severity as keyof typeof colors] || colors.default;
  
  const svgContent = `
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" font-size="12" fill="white">!</text>
    </svg>
  `.trim();
  
  const encodedSvg = window.btoa(unescape(encodeURIComponent(svgContent)));
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${encodedSvg}`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

// Component to update map view
const MapUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

interface MinimalHazardMapProps {
  onReportClick?: (report: any) => void;
  height?: string;
  showControls?: boolean;
}

const MinimalHazardMap: React.FC<MinimalHazardMapProps> = ({ 
  onReportClick, 
  height = '500px',
  showControls = true 
}) => {
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [statistics, setStatistics] = useState<any>({});
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);
  const [selectedReport, setSelectedReport] = useState<HazardReport | null>(null);
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    status: 'all',
    showHotspots: true,
    showReports: true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = realTimeHazardService.subscribe((newReports, newHotspots) => {
      setReports(newReports);
      setHotspots(newHotspots);
      setStatistics(realTimeHazardService.getStatistics());
      setLastUpdate(new Date().toLocaleTimeString());
    });

    return unsubscribe;
  }, []);

  // Handle location search
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await LocationSearchService.searchLocation(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Debounce search

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  // Filter reports based on current filters
  const filteredReports = reports.filter(report => {
    if (filters.severity !== 'all' && report.severity !== filters.severity) return false;
    if (filters.type !== 'all' && report.type !== filters.type) return false;
    if (filters.status !== 'all' && report.status !== filters.status) return false;
    return true;
  });

  const handleReportClick = (report: HazardReport) => {
    setSelectedReport(report);
    setMapCenter([report.location.latitude, report.location.longitude]);
    setMapZoom(12);
    if (onReportClick) onReportClick(report);
  };

  const handleSearchResultClick = (result: any) => {
    setMapCenter([result.lat, result.lon]);
    setMapZoom(12);
    setSearchQuery('');
    setSearchResults([]);
  };

  const quickLocations = [
    { name: 'All India', coords: [20.5937, 78.9629], zoom: 5 },
    { name: 'Mumbai', coords: [19.0760, 72.8777], zoom: 10 },
    { name: 'Chennai', coords: [13.0827, 80.2707], zoom: 10 },
    { name: 'Kochi', coords: [9.9312, 76.2673], zoom: 10 },
    { name: 'Visakhapatnam', coords: [17.6868, 83.2185], zoom: 10 },
    { name: 'Goa', coords: [15.2993, 74.1240], zoom: 10 }
  ];

  return (
    <div className="w-full">
      {/* Simple Header */}
      {showControls && (
        <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Hazard Monitor</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">Real-time ocean hazard tracking</p>
                  <div className="flex items-center space-x-1">
                    <Activity className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">Live</span>
                    {lastUpdate && (
                      <span className="text-xs text-gray-500">• Updated {lastUpdate}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{statistics.critical}</div>
                <div className="text-xs text-gray-500">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{statistics.active}</div>
                <div className="text-xs text-gray-500">Active</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{statistics.total}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{hotspots.length}</div>
                <div className="text-xs text-gray-500">Hotspots</div>
              </div>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search locations in India..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="loading"></div>
                </div>
              )}
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchResultClick(result)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900 text-sm">{result.display_name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Location Buttons */}
            <div className="flex flex-wrap gap-2">
              {quickLocations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setMapCenter(location.coords as [number, number]);
                    setMapZoom(location.zoom);
                  }}
                  className="btn-secondary px-3 py-1 text-sm"
                >
                  {location.name}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filters.severity}
                onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                className="input text-sm px-2 py-1"
              >
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="input text-sm px-2 py-1"
              >
                <option value="all">All Types</option>
                <option value="cyclone">Cyclone</option>
                <option value="flood">Flood</option>
                <option value="tsunami">Tsunami</option>
                <option value="pollution">Pollution</option>
                <option value="erosion">Erosion</option>
              </select>
            </div>

            {/* Layer Toggles */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.showReports}
                  onChange={(e) => setFilters(prev => ({ ...prev, showReports: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Reports</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.showHotspots}
                  onChange={(e) => setFilters(prev => ({ ...prev, showHotspots: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Hotspots</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden" style={{ height }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ width: '100%', height: '100%' }}
        >
          <MapUpdater center={mapCenter} zoom={mapZoom} />
          
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Hazard Reports */}
          {filters.showReports && filteredReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.location.latitude, report.location.longitude]}
              icon={createSimpleIcon(report.severity)}
              eventHandlers={{
                click: () => handleReportClick(report)
              }}
            >
              <Popup>
                <div className="min-w-[280px]">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-base font-semibold text-gray-900">{report.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="text-gray-900">{report.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="text-gray-900">{report.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="text-gray-900">{report.location.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reported:</span>
                      <span className="text-gray-900">{new Date(report.reportedAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {report.description && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-gray-700 text-sm">{report.description}</p>
                    </div>
                  )}
                  
                  {report.affectedArea && (
                    <div className="mt-2 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-700">Affected Area: {report.affectedArea}</span>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Hotspots */}
          {filters.showHotspots && hotspots.map((hotspot) => (
            <Circle
              key={hotspot.id}
              center={hotspot.center as [number, number]}
              radius={hotspot.radius}
              fillColor={
                hotspot.intensity === 'high' ? '#dc2626' :
                hotspot.intensity === 'medium' ? '#ea580c' : '#16a34a'
              }
              fillOpacity={0.2}
              color={
                hotspot.intensity === 'high' ? '#dc2626' :
                hotspot.intensity === 'medium' ? '#ea580c' : '#16a34a'
              }
              weight={2}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h4 className="text-base font-semibold text-gray-900 mb-2">Hazard Hotspot</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Intensity:</span>
                      <span className={`font-medium ${
                        hotspot.intensity === 'high' ? 'text-red-600' :
                        hotspot.intensity === 'medium' ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {hotspot.intensity.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reports:</span>
                      <span className="text-gray-900">{hotspot.reportCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Types:</span>
                      <span className="text-blue-600">{hotspot.dominantTypes.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>

      {/* Selected Report Details Panel */}
      {selectedReport && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedReport.title}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Severity: </span>
                  <span className={`font-medium ${
                    selectedReport.severity === 'critical' ? 'text-red-600' :
                    selectedReport.severity === 'high' ? 'text-orange-600' :
                    selectedReport.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {selectedReport.severity}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Type: </span>
                  <span className="text-gray-900">{selectedReport.type.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status: </span>
                  <span className="text-gray-900">{selectedReport.status}</span>
                </div>
                <div>
                  <span className="text-gray-500">Population: </span>
                  <span className="text-gray-900">{selectedReport.estimatedAffectedPopulation?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedReport(null)}
              className="btn-secondary px-3 py-1 ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalHazardMap;