import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { hazardReportService } from '../services/hazardReportService';
import { 
  MapPin,
  Filter,
  RefreshCw,
  AlertTriangle,
  Navigation,
  Layers 
} from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 19.0760, // Mumbai coordinates for Indian Ocean region
  lng: 72.8777
};

interface Report {
  id: string;
  type: string;
  severity: string;
  status: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

const HazardMap: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  })

  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);
  
  const fetchReports = async () => {
    setIsRefreshing(true);
    try {
      const fetchedReports = await hazardReportService.getReports({});
      setReports(fetchedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const filteredReports = reports.filter(report => {
    if (filterType === 'all') return true;
    return report.type === filterType;
  });

  const getMarkerIcon = (report: Report) => {
    const severityColors = {
      low: '#22c55e',     // green
      medium: '#f59e0b',  // amber 
      high: '#ef4444',    // red
      critical: '#dc2626' // dark red
    };
    
    const color = severityColors[report.severity as keyof typeof severityColors] || severityColors.medium;
    
    return {
      path: 'M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,7A2,2 0 0,1 14,9A2,2 0 0,1 12,11A2,2 0 0,1 10,9A2,2 0 0,1 12,7Z',
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 1.5,
    };
  };

  if (!isLoaded) {
    return (
      <div className="card-feature animate-fade-in">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="loading mb-4" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-feature animate-fade-in">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3 mb-4 lg:mb-0">
          <MapPin className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ocean Hazard Map</h2>
            <p className="text-gray-600">Real-time hazard monitoring for Indian coastal regions</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchReports}
            disabled={isRefreshing}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      {/* Filter Controls */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Hazards</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            className={`px-4 py-2 rounded-full border transition-all ${
              filterType === 'all'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
            }`}
            onClick={() => setFilterType('all')}
          >
            All Hazards ({reports.length})
          </button>
          
          {['tsunami', 'storm', 'high_tide', 'rip_current'].map((type) => {
            const count = reports.filter(h => h.type === type).length;
            
            return (
              <button
                key={type}
                className={`px-4 py-2 rounded-full border transition-all capitalize ${
                  filterType === type
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => setFilterType(type)}
              >
                {type.replace('_', ' ')} ({count})
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Map Container */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
        <div className="h-[600px] relative">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={8}
          >
            {filteredReports.map(report => (
              <Marker 
                key={report.id}
                position={{ lat: report.location.latitude, lng: report.location.longitude }}
                onClick={() => setSelectedReport(report)}
                icon={getMarkerIcon(report)}
              />
            ))}

            {selectedReport && (
              <InfoWindow
                position={{ lat: selectedReport.location.latitude, lng: selectedReport.location.longitude }}
                onCloseClick={() => setSelectedReport(null)}
              >
                <div className="p-3 max-w-sm">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-bold text-gray-900 capitalize">
                      {selectedReport.type.replace('_', ' ')}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-600">Severity:</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium capitalize bg-red-100 text-red-800">
                        {selectedReport.severity}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        selectedReport.status === 'active' ? 'bg-red-100 text-red-800' :
                        selectedReport.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedReport.status}
                      </span>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-700">{selectedReport.description}</p>
                    </div>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{reports.length}</div>
          <div className="text-sm text-blue-800">Total Reports</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">
            {reports.filter(r => r.status === 'active').length}
          </div>
          <div className="text-sm text-red-800">Active Hazards</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {reports.filter(r => r.status === 'resolved').length}
          </div>
          <div className="text-sm text-green-800">Resolved</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">
            {reports.filter(r => r.severity === 'critical').length}
          </div>
          <div className="text-sm text-orange-800">Critical Cases</div>
        </div>
      </div>
    </div>
  )
}

export default HazardMap
