import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaList, 
  FaMap, 
  FaChartBar, 
  FaUser, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaChevronRight,
  FaShieldAlt,
  FaBell,
  FaCog,
  FaAward
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const GovernmentSidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { 
      path: '/government', 
      icon: FaHome, 
      label: 'Dashboard',
      description: 'Overview & Stats'
    },
    { 
      path: '/government/complaints', 
      icon: FaList, 
      label: 'All Complaints',
      description: 'Manage Issues'
    },
    { 
      path: '/government/map', 
      icon: FaMap, 
      label: 'Complaints Map',
      description: 'Geographic View'
    },
    { 
      path: '/government/analytics', 
      icon: FaChartBar, 
      label: 'Analytics',
      description: 'Reports & Insights'
    },
    { 
      path: '/government/profile', 
      icon: FaUser, 
      label: 'Profile',
      description: 'Account Settings'
    },
  ];

  const isActive = (path) => {
    if (path === '/government' && location.pathname === '/government') return true;
    if (path !== '/government' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-80'}
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
        backdrop-blur-xl border-r border-white/10
      `}>
        
        {/* Header Section */}
        <div className="relative p-6 border-b border-white/10">
          {/* Background Gradient Orb */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            {!isCollapsed && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Government Portal
                  </h2>
                  <button
                    onClick={toggleCollapse}
                    className="hidden lg:block p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <FaChevronRight className={`transform transition-transform duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
                  </button>
                </div>
                
                {/* User Info */}
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <FaShieldAlt className="text-white text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{user?.name || 'Government Official'}</p>
                    <p className="text-white/60 text-sm truncate">{user?.email}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaAward className="text-yellow-400 text-xs" />
                    <span className="text-white/80 text-xs">Admin</span>
                  </div>
                </div>
              </>
            )}
            
            {isCollapsed && (
              <div className="flex flex-col items-center">
                <button
                  onClick={toggleCollapse}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 mb-4"
                >
                  <FaChevronRight />
                </button>
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <FaShieldAlt className="text-white text-sm" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  group relative flex items-center rounded-xl transition-all duration-300 overflow-hidden
                  ${isCollapsed ? 'p-3 justify-center' : 'p-4'}
                  ${active 
                    ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 shadow-lg shadow-emerald-500/10' 
                    : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                  }
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Active Indicator */}
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-r-full" />
                )}
                
                {/* Hover Glow Effect */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300 rounded-xl
                `} />
                
                <div className={`relative z-10 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'} w-full`}>
                  <div className={`
                    flex items-center justify-center rounded-lg transition-all duration-300
                    ${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'}
                    ${active 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                      : 'bg-white/10 text-white/70 group-hover:text-white group-hover:bg-white/20'
                    }
                  `}>
                    <item.icon className={isCollapsed ? 'text-sm' : 'text-lg'} />
                  </div>
                  
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium transition-colors duration-200 ${
                        active ? 'text-white' : 'text-white/80 group-hover:text-white'
                      }`}>
                        {item.label}
                      </p>
                      <p className={`text-sm transition-colors duration-200 ${
                        active ? 'text-emerald-200' : 'text-white/50 group-hover:text-white/70'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  )}
                  
                  {!isCollapsed && (
                    <FaChevronRight className={`
                      text-white/40 group-hover:text-white/60 transition-all duration-200
                      ${active ? 'transform translate-x-1 text-white/80' : ''}
                    `} />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/10">
          {/* System Status */}
          {!isCollapsed && (
            <div className="mb-4 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <FaBell className="text-green-400" />
                <span className="text-white/80 font-medium text-sm">System Status</span>
              </div>
              <p className="text-white/60 text-xs">All systems operational</p>
            </div>
          )}
          
          {/* Settings & Logout */}
          <div className="space-y-2">
            {!isCollapsed && (
              <button className="w-full flex items-center space-x-3 p-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300">
                <FaCog className="text-lg" />
                <span className="font-medium">Settings</span>
              </button>
            )}
            
            <button
              onClick={logout}
              className={`
                group relative w-full flex items-center rounded-xl transition-all duration-300 overflow-hidden
                ${isCollapsed ? 'p-3 justify-center' : 'p-4'}
                hover:bg-red-500/10 border border-transparent hover:border-red-500/30
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              
              <div className={`relative z-10 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'} w-full`}>
                <div className={`
                  flex items-center justify-center rounded-lg transition-all duration-300
                  ${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'}
                  bg-white/10 text-red-400 group-hover:bg-red-500/20 group-hover:text-red-300
                `}>
                  <FaSignOutAlt className={isCollapsed ? 'text-sm' : 'text-lg'} />
                </div>
                
                {!isCollapsed && (
                  <span className="font-medium text-red-400 group-hover:text-red-300 transition-colors duration-200">
                    Logout
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GovernmentSidebar;
