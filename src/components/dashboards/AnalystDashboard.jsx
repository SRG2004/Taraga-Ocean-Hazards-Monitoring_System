import React, { useState, useEffect } from 'react';
import { realTimeHazardService } from '../../services/realTimeHazardService.js';
import { MinimalHazardMap } from '../MinimalHazardMap';
import SyntheticReportGenerator from '../SyntheticReportGenerator';
import { 
  BarChart3,
  TrendingUp,
  Activity,
  Eye,
  Search,
  Filter,
  Calendar,
  MapPin,
  AlertTriangle,
  Users,
  Clock,
  FileText,
  Download,
  Share,
  MessageSquare,
  Globe
} from 'lucide-react';

export const AnalystDashboard = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [lastUpdate, setLastUpdate] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    const unsubscribe = realTimeHazardService.subscribe((newReports, hotspots) => {
      setReports(newReports);
      setStatistics(realTimeHazardService.getStatistics());
      setLastUpdate(new Date().toLocaleTimeString());
    });

    return unsubscribe;
  }, []);

  // Mock social media data for demonstration
  const socialMediaTrends = [
    { platform: 'Twitter', mentions: 247, sentiment: 0.3, trend: '+15%' },
    { platform: 'Facebook', mentions: 156, sentiment: 0.1, trend: '+8%' },
    { platform: 'Instagram', mentions: 89, sentiment: 0.6, trend: '+22%' },
    { platform: 'YouTube', mentions: 34, sentiment: 0.4, trend: '+5%' },
  ];

  const keyInsights = [
    {
      title: 'Cyclone Pattern Analysis',
      description: 'Seasonal cyclone frequency shows 23% increase compared to last year',
      priority: 'high',
      timeframe: '30 days'
    },
    {
      title: 'Coastal Erosion Trends',
      description: 'Gujarat coastline showing accelerated erosion rates in 3 districts',
      priority: 'medium',
      timeframe: '90 days'
    },
    {
      title: 'Public Response Effectiveness',
      description: 'Early warning system response time improved by 18%',
      priority: 'low',
      timeframe: '60 days'
    },
  ];

  const generateReport = (type) => {
    console.log(`Generating ${type} report...`);
    // Implementation for report generation
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Intelligence Center</h1>
            <p className="text-gray-600 mt-2">Data-driven insights for ocean hazard patterns and trends</p>
            <div className="flex items-center space-x-2 mt-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">Real-time Analysis Active</span>
              <span className="text-sm text-gray-500">• Last updated {lastUpdate}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Analysis Scope</div>
            <div className="text-lg font-semibold text-gray-900">Pan-India Coastal</div>
            <div className="text-sm text-gray-600">All Maritime States</div>
          </div>
        </div>
      </div>

      {/* Analysis Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="input text-sm"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="input text-sm"
            >
              <option value="all">All Regions</option>
              <option value="west">West Coast</option>
              <option value="east">East Coast</option>
              <option value="south">Southern Coast</option>
              <option value="islands">Island Territories</option>
            </select>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <Share className="w-4 h-4" />
            <span>Share Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Total Reports</h3>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">{statistics.total || 0}</div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <p className="text-green-600 text-sm">+12% from last period</p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Pattern Recognition</h3>
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">87%</div>
          <p className="text-gray-500 text-sm">Accuracy rate</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Social Mentions</h3>
            <MessageSquare className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-2">526</div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <p className="text-green-600 text-sm">+18% today</p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Response Time</h3>
            <Clock className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">8.3m</div>
          <p className="text-gray-500 text-sm">Average analysis time</p>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hazard Trends Analysis */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Hazard Trends</h3>
            <button className="btn-secondary">Detailed View</button>
          </div>
          <div className="space-y-4">
            {Object.entries(statistics.byType || {}).map(([type, count], i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    type === 'cyclone' ? 'bg-red-500' :
                    type === 'flood' ? 'bg-blue-500' :
                    type === 'tsunami' ? 'bg-purple-500' :
                    'bg-gray-500'
                  }`} />
                  <span className="font-medium text-gray-900 capitalize">{type}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-500">reports</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Monitoring */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Social Media Insights</h3>
            <button className="btn-secondary">Monitor Live</button>
          </div>
          <div className="space-y-4">
            {socialMediaTrends.map((platform, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-900">{platform.platform}</span>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">{platform.mentions}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      platform.sentiment > 0.3 ? 'bg-green-100 text-green-800' :
                      platform.sentiment > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {platform.sentiment > 0.3 ? 'Positive' :
                       platform.sentiment > 0 ? 'Neutral' : 'Negative'}
                    </span>
                  </div>
                  <div className="text-sm text-green-600">{platform.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Insights & Recommendations</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {keyInsights.map((insight, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                  insight.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {insight.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{insight.timeframe}</span>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Analysis */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Analysis Tools</h3>
          <div className="space-y-3">
            <button 
              onClick={() => generateReport('trend')}
              className="w-full btn-primary flex items-center justify-center space-x-3 py-3"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Generate Trend Report</span>
            </button>
            <button 
              onClick={() => generateReport('prediction')}
              className="w-full btn-secondary flex items-center justify-center space-x-3 py-3"
            >
              <Eye className="w-5 h-5" />
              <span>Predictive Analysis</span>
            </button>
            <button 
              onClick={() => generateReport('social')}
              className="w-full btn-secondary flex items-center justify-center space-x-3 py-3"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Social Media Report</span>
            </button>
            <button 
              onClick={() => generateReport('comparison')}
              className="w-full btn-secondary flex items-center justify-center space-x-3 py-3"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Comparative Analysis</span>
            </button>
          </div>
        </div>

        <div className="card">
          <SyntheticReportGenerator />
        </div>

        {/* Data Sources */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Data Sources Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-semibold text-green-800">Citizen Reports</div>
                <div className="text-sm text-green-600">Real-time feed active</div>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-semibold text-green-800">Weather Services</div>
                <div className="text-sm text-green-600">IMD integration</div>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium">Synced</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-semibold text-blue-800">Social Media APIs</div>
                <div className="text-sm text-blue-600">Multi-platform monitoring</div>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-blue-600 font-medium">Monitoring</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-800">Satellite Data</div>
                <div className="text-sm text-gray-600">ISRO feed</div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600 font-medium">Scheduled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map with Analytics Overlay */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Analytics Map View</h3>
          <div className="flex space-x-2">
            <button className="btn-secondary">Heat Map</button>
            <button className="btn-secondary">Cluster View</button>
            <button className="btn-secondary">Timeline</button>
          </div>
        </div>
        <div className="h-96">
          <MinimalHazardMap height="384px" showControls={true} />
        </div>
      </div>
    </div>
  );
};
