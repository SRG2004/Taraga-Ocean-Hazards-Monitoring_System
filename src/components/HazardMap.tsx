import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { hazardReportService } from '../services/hazardReportService';
import './HazardMap.css';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: -3.745, 
  lng: -38.523
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
    googleMapsApiKey: "AIzaSyDpMc5FqjK_tTqGIheS8LNZIXyL9-rufqo"
  })

  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      const fetchedReports = await hazardReportService.getReports({});
      setReports(fetchedReports);
    };
    fetchReports();
  }, []);

  const getMarkerIcon = (report: Report) => {
    // ... (logic to return different marker icons based on report type, severity, etc.)
    return null;
  }

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        {reports.map(report => (
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
            <div className="info-window">
              <h3>{selectedReport.type}</h3>
              <p>Severity: {selectedReport.severity}</p>
              <p>Status: {selectedReport.status}</p>
              <p>{selectedReport.description}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
  ) : <></>
}

export default HazardMap
