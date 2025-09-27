import React, { useState, useEffect } from 'react';
import { realTimeHazardService, type HazardReport } from '../../services/realTimeHazardService';
import { MinimalHazardMap } from '../MinimalHazardMap';
import { 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Users,
  MapPin,
  Phone,
  FileText,
  Activity,
  TrendingUp,
  Shield,
  Radio,
  Truck
} from 'lucide-react';

interface OfficialDashboardProps {
  user: any;
}

export const OfficialDashboard: React.FC<OfficialDashboardProps> = ({ user }) => {
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [statistics, setStatistics] = useState<any>({});
  const [activeIncidents, setActiveIncidents] = useState<HazardReport[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const unsubscribe = realTimeHazardService.subscribe((newReports, hotspots) => {
      setReports(newReports);
      setStatistics(realTimeHazardService.getStatistics());
      
      // Filter active incidents that need attention
      const active = newReports.filter(report => 
        report.status === 'active' && 
        (report.severity === 'critical' || report.severity === 'high')
      );
      setActiveIncidents(active);
      setLastUpdate(new Date().toLocaleTimeString());
    });

    return unsubscribe;
  }, []);

  const resourceStatus = [
    { name: 'Coast Guard Vessels', available: 12, deployed: 3, status: 'operational' },
    { name: 'Emergency Teams', available: 8, deployed: 2, status: 'operational' },
    { name: 'Medical Units', available: 15, deployed: 1, status: 'operational' },
    { name: 'Evacuation Centers', available: 25, deployed: 0, status: 'standby' },
  ];

  const handleIncidentAction = (incident: HazardReport, action: string) => {
    console.log(`${action} action for incident:`, incident.id);
    // Implementation for incident actions
  };

  return (
    <div className="space-y-6">
      {/* Command Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Operations Command Center</h1>
            <p className="text-gray-600 mt-2">Real-time incident management and resource coordination</p>
            <div className="flex items-center space-x-2 mt-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">All Systems Operational</span>
              <span className="text-sm text-gray-500">• Last updated {lastUpdate}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Command Zone</div>
            <div className="text-lg font-semibold text-gray-900">{user?.district || 'Mumbai Coastal'}</div>
            <div className="text-sm text-gray-600">{user?.state || 'Maharashtra'}</div>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {activeIncidents.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">
                {activeIncidents.length} Critical Incident{activeIncidents.length > 1 ? 's' : ''} Requiring Attention
              </h3>
              <p className="text-red-700">
                Immediate response needed for {activeIncidents.filter(i => i.severity === 'critical').length} critical situations
              </p>
            </div>
            <button className="btn-primary bg-red-600 hover:bg-red-700">Command Response</button>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Active Incidents</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">{statistics.active || 0}</div>
          <p className="text-gray-500 text-sm">Requiring response</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Critical Alerts</h3>
            <Shield className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-2">{statistics.critical || 0}</div>
          <p className="text-gray-500 text-sm">High priority</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Resources Deployed</h3>
            <Truck className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
          <p className="text-gray-500 text-sm">Teams in field</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Response Time</h3>
            <Clock className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">12m</div>
          <p className="text-gray-500 text-sm">Average today</p>
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Incidents */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Active Incidents</h3>
            <button className="btn-secondary">View All</button>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activeIncidents.slice(0, 5).map((incident) => (
              <div key={incident.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{incident.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        incident.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        incident.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {incident.severity.toUpperCase()}
                      </span>
                      <span className="text-gray-500">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {incident.location.district}
                      </span>
                      <span className="text-gray-500">
                        {new Date(incident.reportedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleIncidentAction(incident, 'acknowledge')}
                    className="btn-secondary text-sm px-3 py-1"
                  >
                    Acknowledge
                  </button>
                  <button 
                    onClick={() => handleIncidentAction(incident, 'dispatch')}
                    className="btn-primary text-sm px-3 py-1"
                  >
                    Dispatch Team
                  </button>
                  <button 
                    onClick={() => handleIncidentAction(incident, 'escalate')}
                    className="btn-secondary text-sm px-3 py-1 border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    Escalate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Status */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Resource Status</h3>
          <div className="space-y-4">
            {resourceStatus.map((resource, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{resource.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    resource.status === 'operational' ? 'bg-green-100 text-green-800' :
                    resource.status === 'standby' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {resource.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex space-x-4">
                    <span className="text-green-600">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      {resource.available} Available
                    </span>
                    <span className="text-blue-600">
                      <Activity className="w-4 h-4 inline mr-1" />
                      {resource.deployed} Deployed
                    </span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Command Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Commands</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary flex items-center justify-center space-x-3 py-3">
              <AlertTriangle className="w-5 h-5" />
              <span>Issue Public Alert</span>
            </button>
            <button className="w-full btn-secondary flex items-center justify-center space-x-3 py-3">
              <Radio className="w-5 h-5" />
              <span>Contact Field Teams</span>
            </button>
            <button className="w-full btn-secondary flex items-center justify-center space-x-3 py-3">
              <Truck className="w-5 h-5" />
              <span>Deploy Resources</span>
            </button>
            <button className="w-full btn-secondary flex items-center justify-center space-x-3 py-3">
              <FileText className="w-5 h-5" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        {/* Communication Center */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Communications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-semibold text-green-800">Coast Guard HQ</div>
                <div className="text-sm text-green-600">Online • Ready</div>
              </div>
              <button className="btn-primary bg-green-600 hover:bg-green-700">
                <Phone className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-semibold text-blue-800">Field Team Alpha</div>
                <div className="text-sm text-blue-600">In transit • ETA 15m</div>
              </div>
              <button className="btn-primary bg-blue-600 hover:bg-blue-700">
                <Radio className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <div className="font-semibold text-purple-800">State Control</div>
                <div className="text-sm text-purple-600">Standby • Monitoring</div>
              </div>
              <button className="btn-primary bg-purple-600 hover:bg-purple-700">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Situational Awareness */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Situational Awareness</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="font-semibold text-blue-800">Weather Update</div>
              <div className="text-sm text-blue-600 mt-1">
                Moderate winds expected. Sea conditions: Rough. Visibility: Good
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="font-semibold text-green-800">Traffic Status</div>
              <div className="text-sm text-green-600 mt-1">
                All evacuation routes clear. Emergency lanes available
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="font-semibold text-yellow-800">Public Readiness</div>
              <div className="text-sm text-yellow-600 mt-1">
                85% evacuation compliance. 3 shelter requests pending
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operations Map */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Operations Map</h3>
          <button className="btn-secondary">Full Screen View</button>
        </div>
        <div className="h-96">
          <MinimalHazardMap height="384px" showControls={true} />
        </div>
      </div>
    </div>
  );
};