import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import './AnalyticsDashboard.css';

const AnalyticsDashboard: React.FC = () => {
  const { reports, loadReports } = useApp();

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // In a real app, you'd have more sophisticated analytics.
  // This is a simplified example.
  const hazardCounts = reports.reduce((acc, report) => {
    acc[report.hazardType] = (acc[report.hazardType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="analytics-dashboard">
      <header className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <p>Insights into reported hazards.</p>
      </header>

      <div className="analytics-grid">
        {/* Hazard Type Distribution */}
        <div className="analytics-card">
          <h2>Hazard Type Distribution</h2>
          {Object.keys(hazardCounts).length > 0 ? (
            <ul>
              {Object.entries(hazardCounts).map(([type, count]) => (
                <li key={type}>
                  <span>{type}</span>
                  <span>{count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hazard data available.</p>
          )}
        </div>

        {/* Other analytics could go here */}
        <div className="analytics-card">
          <h2>Geographic Hotspots</h2>
          <p>Hotspot analysis would be displayed here.</p>
          {/* Placeholder for a map or chart */}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
