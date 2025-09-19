import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBuilding, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', show: true },
    { name: 'Citizen Portal', path: '/citizen', show: user?.userType === 'citizen' },
    { name: 'Government Portal', path: '/government', show: user?.userType === 'government' },
    { name: 'Complaints', path: user?.userType === 'citizen' ? '/citizen/complaints' : '/government/complaints', show: !!user },
    { name: 'Updates', path: '/updates', show: true },
    { name: 'About', path: '/about', show: true },
    { name: 'Contact', path: '/contact', show: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-glass border-b border-white/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="bg-gradient-to-r from-primary-500 to-purple-600 p-2 rounded-lg mr-3 group-hover:shadow-glow transition-all duration-300">
              <FaBuilding className="text-xl text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              GovConnect
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.filter(link => link.show).map((link) => (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
                  isActive(link.path)
                    ? 'text-primary-600'
                    : scrolled 
                      ? 'text-gray-700 hover:text-primary-600' 
                      : 'text-gray-800 hover:text-primary-600'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-purple-600 transform origin-left transition-transform duration-300 ${
                  isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </button>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <FaUser className={`text-sm ${scrolled ? 'text-gray-600' : 'text-gray-700'}`} />
                  <span className={`text-sm font-medium ${scrolled ? 'text-gray-700' : 'text-gray-800'}`}>
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:shadow-glow"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/login')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    scrolled
                      ? 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
                      : 'text-gray-800 hover:text-primary-600 hover:bg-white/10'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-primary-600 hover:to-purple-700 transition-all duration-300 hover:shadow-glow"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                scrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-gray-800 hover:bg-white/10'
              }`}
            >
              {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-white/20 shadow-glass animate-slide-down">
            <div className="px-4 py-6 space-y-4">
              {navLinks.filter(link => link.show).map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    navigate(link.path);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                      <FaUser className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
                    >
                      <FaSignOutAlt className="text-sm" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        navigate('/login');
                        setIsOpen(false);
                      }}
                      className="block w-full px-4 py-3 text-center text-primary-600 font-medium rounded-lg border border-primary-200 hover:bg-primary-50 transition-all duration-300"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate('/register');
                        setIsOpen(false);
                      }}
                      className="block w-full px-4 py-3 text-center bg-gradient-to-r from-primary-500 to-purple-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-purple-700 transition-all duration-300"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
