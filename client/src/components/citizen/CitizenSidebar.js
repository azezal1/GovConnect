import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaPlus, 
  FaList, 
  FaUser, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaChevronRight,
  FaStar,
  FaBell
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const CitizenSidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { 
      path: '/citizen', 
      icon: FaHome, 
      label: 'Dashboard',
      description: 'Overview & Stats'
    },
    { 
      path: '/citizen/submit', 
      icon: FaPlus, 
      label: 'Submit Complaint',
      description: 'Report New Issue'
    },
    { 
      path: '/citizen/complaints', 
      icon: FaList, 
      label: 'My Complaints',
      description: 'Track Progress'
    },
    { 
      path: '/citizen/profile', 
      icon: FaUser, 
      label: 'Profile',
      description: 'Account Settings'
    },
  ];

  const isActive = (path) => {
    if (path === '/citizen' && location.pathname === '/citizen') return true;
    if (path !== '/citizen' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            {!isCollapsed && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Citizen Portal
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
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{user?.name || 'Citizen'}</p>
                    <p className="text-white/60 text-sm truncate">{user?.email}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span className="text-white/80 text-xs">4.8</span>
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
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-sm" />
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
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                    : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                  }
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Active Indicator */}
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full" />
                )}
                
                {/* Hover Glow Effect */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300 rounded-xl
                `} />
                
                <div className={`relative z-10 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'} w-full`}>
                  <div className={`
                    flex items-center justify-center rounded-lg transition-all duration-300
                    ${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'}
                    ${active 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
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
                        active ? 'text-blue-200' : 'text-white/50 group-hover:text-white/70'
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
          {/* Notifications */}
          {!isCollapsed && (
            <div className="mb-4 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <FaBell className="text-amber-400" />
                <span className="text-white/80 font-medium text-sm">Notifications</span>
              </div>
              <p className="text-white/60 text-xs">You have 2 complaint updates</p>
            </div>
          )}
          
          {/* Logout Button */}
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
    </>
  );
};

export default CitizenSidebar;
