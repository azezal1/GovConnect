import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaList, FaMap, FaChartBar, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const GovernmentSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/government', icon: FaHome, label: 'Home' },
    { path: '/government/complaints', icon: FaList, label: 'All Complaints' },
    { path: '/government/map', icon: FaMap, label: 'Complaints Map' },
    { path: '/government/analytics', icon: FaChartBar, label: 'Analytics' },
    { path: '/government/profile', icon: FaUser, label: 'Profile' },
  ];

  const isActive = (path) => {
    if (path === '/government' && location.pathname === '/government') return true;
    if (path !== '/government' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-64 h-fit">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Government Portal</h2>
        <p className="text-gray-600">Manage & Monitor Issues</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-green-50 text-green-600 border-l-4 border-green-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <item.icon className="text-lg" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default GovernmentSidebar;
