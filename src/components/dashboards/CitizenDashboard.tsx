import React, { useState, useEffect } from 'react';
import { realTimeHazardService, type HazardReport } from '../../services/realTimeHazardService';
import { MinimalHazardMap } from '../MinimalHazardMap';
import { 
  AlertTriangle, 
  MapPin, 
  Phone, 
  Shield, 
  Activity,
  Bell,
  Users,
  FileText,
  DollarSign
} from 'lucide-react';

interface CitizenDashboardProps {
  user: any;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ user }) => {
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [statistics, setStatistics] = useState<any>({});
  const [nearbyAlerts, setNearbyAlerts] = useState<HazardReport[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const unsubscribe = realTimeHazardService.subscribe((newReports) => {
      setReports(newReports);
      setStatistics(realTimeHazardService.getStatistics());
      
      // Filter nearby alerts (within 50km of user location - simulated)
      const userLat = 19.0760; // Mumbai coordinates as example
      const userLng = 72.8777;
      const nearby = newReports.filter(report => {
        const distance = Math.sqrt(
          Math.pow(report.location.latitude - userLat, 2) + 
          Math.pow(report.location.longitude - userLng, 2)
        );
        return distance < 0.5 && report.status === 'active'; // Approximate 50km radius
      });
      setNearbyAlerts(nearby);
      setLastUpdate(new Date().toLocaleTimeString());
    });

    return unsubscribe;
  }, []);

  const recentActivity = [
    { 
      time: '2 hours ago', 
      event: 'Cyclone warning issued for your area', 
      type: 'warning', 
      icon: <AlertTriangle className="w-4 h-4" />
    },
    { 
      time: '1 day ago', 
      event: 'Your hazard report was verified', 
      type: 'success', 
      icon: <Shield className="w-4 h-4" />
    },
    { 
      time: '2 days ago', 
      event: 'Emergency drill notification sent', 
      type: 'info', 
      icon: <Bell className="w-4 h-4" />
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'Citizen'}</h1>
            <p className="text-gray-600 mt-2">Stay informed about ocean hazards in your area</p>
            <div className="flex items-center space-x-2 mt-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">System Active</span>
              <span className="text-sm text-gray-500">• Last updated {lastUpdate}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Your Location</div>
            <div className="text-lg font-semibold text-gray-900">Mumbai, Maharashtra</div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {nearbyAlerts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="text-lg font-semibold text-orange-800">
                {nearbyAlerts.length} Active Alert{nearbyAlerts.length > 1 ? 's' : ''} Near You
              </h3>
              <p className="text-orange-700">
                {nearbyAlerts[0]?.title} - Stay alert and follow safety guidelines
              </p>
            </div>
            <button className="btn-primary">View Details</button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Active Alerts</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">{statistics.active || 0}</div>
          <p className="text-gray-500 text-sm">In your region</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Reports Today</h3>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">{statistics.today || 0}</div>
          <p className="text-gray-500 text-sm">Across all regions</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Emergency Contacts</h3>
            <Phone className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">3</div>
          <p className="text-gray-500 text-sm">Available 24/7</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Community</h3>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">1.2k</div>
          <p className="text-gray-500 text-sm">Active volunteers</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary flex items-center justify-center space-x-3 py-4">
              <FileText className="w-5 h-5" />
              <span>Report Ocean Hazard</span>
            </button>
            <button className="w-full btn-secondary flex items-center justify-center space-x-3 py-4">
              <MapPin className="w-5 h-5" />
              <span>View Hazard Map</span>
            </button>
            <button className="w-full btn-secondary flex items-center justify-center space-x-3 py-4">
              <Users className="w-5 h-5" />
              <span>Join as Volunteer</span>
            </button>
            <button className="w-full btn-secondary flex items-center justify-center space-x-3 py-4">
              <DollarSign className="w-5 h-5" />
              <span>Support Relief Efforts</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <div className={`p-1 rounded-full ${
                  item.type === 'info' ? 'bg-blue-100 text-blue-600' : 
                  item.type === 'warning' ? 'bg-orange-100 text-orange-600' : 
                  'bg-green-100 text-green-600'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 text-sm font-medium">{item.event}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-blue-600 text-sm font-medium hover:text-blue-700">
            View All Activity
          </button>
        </div>

        {/* Emergency Contacts */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Emergency Contacts</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <div className="font-semibold text-red-800">Coast Guard</div>
                <div className="text-sm text-red-600">Emergency Response</div>
              </div>
              <button className="btn-primary bg-red-600 hover:bg-red-700">
                <Phone className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-semibold text-blue-800">Disaster Management</div>
                <div className="text-sm text-blue-600">State Authority</div>
              </div>
              <button className="btn-primary bg-blue-600 hover:bg-blue-700">
                <Phone className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-semibold text-green-800">Local Police</div>
                <div className="text-sm text-green-600">Area Station</div>
              </div>
              <button className="btn-primary bg-green-600 hover:bg-green-700">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hazard Map Preview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Nearby Hazards</h3>
          <button className="btn-secondary">View Full Map</button>
        </div>
        <div className="h-80">
          <MinimalHazardMap height="320px" showControls={false} />
        </div>
      </div>
    </div>
  );
};