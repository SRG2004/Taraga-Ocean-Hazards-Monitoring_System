import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import './OfficerDashboard.css';

const OfficerDashboard: React.FC = () => {
  const { reports, loadReports } = useApp();

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return (
    <div className="officer-dashboard">
      <h1>Officer Dashboard</h1>
      <p>Live incidents and resource overview.</p>

      <div className="dashboard-content">
        <div className="incident-list card">
          <h2>Current Incidents</h2>
          <div className="incidents">
            {reports.length > 0 ? (
              reports.map((report) => (
                <div key={report.id} className="incident-item">
                  <h3>{report.hazardType}</h3>
                  <p>{report.description}</p>
                  <div className="incident-actions">
                    <button className="btn-action">Acknowledge</button>
                    <button className="btn-action btn-priority">Escalate</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No incidents to display.</p>
            )}
          </div>
        </div>

        <div className="resource-summary card">
          <h2>Resource Allocation</h2>
          <p>Summary of available resources would be shown here.</p>
          {/* Placeholder for resource charts or lists */}
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
