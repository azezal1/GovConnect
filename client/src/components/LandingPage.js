import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaBuilding, FaMapMarkedAlt, FaChartLine, FaShieldAlt } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaMapMarkedAlt className="text-4xl text-primary-500" />,
      title: "Geotagged Reports",
      description: "Submit complaints with precise location data for faster resolution"
    },
    {
      icon: <FaChartLine className="text-4xl text-primary-500" />,
      title: "Real-time Analytics",
      description: "Track complaint trends and resolution statistics in real-time"
    },
    {
      icon: <FaShieldAlt className="text-4xl text-primary-500" />,
      title: "Secure Platform",
      description: "End-to-end encrypted data with secure authentication"
    },
    {
      icon: <FaUsers className="text-4xl text-primary-500" />,
      title: "Citizen Rewards",
      description: "Earn points for valid reports and track your contribution"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FaBuilding className="text-3xl text-primary-600 mr-3" />
              <span className="text-2xl font-bold text-primary-600">GovConnect</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-primary-600 hover:text-primary-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            GovConnect
            <span className="block text-3xl md:text-4xl font-semibold text-primary-600 mt-2">
              Report, Resolve, Reward
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Connecting citizens with government for faster civic issue resolution
          </p>
          
          {/* Login Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('/login')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            >
              <FaUsers className="mr-3" />
              Login as Citizen
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-secondary-600 hover:bg-secondary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            >
              <FaBuilding className="mr-3" />
              Login as Government Official
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose GovConnect?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform streamlines the process of reporting and resolving civic issues, 
            making cities cleaner and safer for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 text-center"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to make your city better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Report Issue</h3>
              <p className="text-gray-600">
                Take a photo, add description, and tag location using our mobile-friendly interface
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your complaint status from pending to resolved in real-time
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Earn Rewards</h3>
              <p className="text-gray-600">
                Get points for valid reports and contribute to a better community
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <FaBuilding className="text-2xl text-primary-400 mr-3" />
            <span className="text-xl font-bold">GovConnect</span>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering citizens and government officials for better civic management
          </p>
          <div className="text-sm text-gray-500">
            © 2024 GovConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
