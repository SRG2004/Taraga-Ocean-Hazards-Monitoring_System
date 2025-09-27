import { Link } from 'react-router-dom';
import { Home, Map, BarChart, User, Settings, DollarSign, Users, Briefcase } from 'lucide-react';

const SideNav = ({ userRole }) => {
    const navItems = {
        citizen: [
            { name: 'Dashboard', icon: Home, path: '/' },
            { name: 'Hazard Map', icon: Map, path: '/map' },
            { name: 'Submit Report', icon: Briefcase, path: '/report' },
            { name: 'Donations', icon: DollarSign, path: '/donate' },
        ],
        official: [
            { name: 'Dashboard', icon: BarChart, path: '/' },
            { name: 'Hazard Map', icon: Map, path: '/map' },
            { name: 'Manage Reports', icon: Briefcase, path: '/reports' },
            { name: 'Volunteers', icon: Users, path: '/volunteers' },
        ],
        analyst: [
            { name: 'Analytics', icon: BarChart, path: '/' },
            { name: 'Real-time Map', icon: Map, path: '/map' },
            { name: 'Social Media', icon: Users, path: '/social-media' },
        ],
        admin: [
            { name: 'User Management', icon: Users, path: '/admin/users' },
            { name: 'System Settings', icon: Settings, path: '/admin/settings' },
        ],
    };

    const getNavItems = () => navItems[userRole] || [];

    return (
        <aside className="w-64 bg-gray-800 text-white p-4">
            <div className="mb-8">
                <h2 className="text-2xl font-bold">Tarang</h2>
                <p className="text-sm text-gray-400">Ocean Hazard Monitoring</p>
            </div>
            <nav>
                <ul>
                    {getNavItems().map((item, index) => (
                        <li key={index} className="mb-4">
                            <Link to={item.path} className="flex items-center p-2 rounded-lg hover:bg-gray-700">
                                <item.icon className="mr-3" />
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="absolute bottom-4 left-4">
                <Link to="/settings" className="flex items-center p-2 rounded-lg hover:bg-gray-700">
                    <Settings className="mr-3" />
                    Settings
                </Link>
            </div>
        </aside>
    );
};

export default SideNav;
