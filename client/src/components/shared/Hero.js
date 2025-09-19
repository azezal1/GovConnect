import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaBuilding, FaArrowRight, FaPlay } from 'react-icons/fa';

const Hero = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const floatingElements = [
    { delay: '0s', duration: '6s', x: '10%', y: '20%' },
    { delay: '2s', duration: '8s', x: '80%', y: '30%' },
    { delay: '4s', duration: '7s', x: '20%', y: '70%' },
    { delay: '1s', duration: '9s', x: '70%', y: '80%' },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Floating Elements */}
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className="absolute w-32 h-32 bg-white/5 rounded-full blur-xl animate-float"
            style={{
              left: element.x,
              top: element.y,
              animationDelay: element.delay,
              animationDuration: element.duration,
            }}
          />
        ))}
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-medium mb-8 animate-fade-in-up">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Trusted by 10,000+ Citizens
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              GovConnect
            </span>
            <span 
              className="block text-3xl md:text-5xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              Report, Resolve, Reward
            </span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            Connecting citizens with government for faster civic issue resolution. 
            Report problems, track progress, and earn rewards for making your community better.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up"
            style={{ animationDelay: '0.8s' }}
          >
            <button
              onClick={() => navigate('/register')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-lg font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center">
                <FaUsers className="mr-3" />
                Get Started
                <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="group px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-center">
                <FaBuilding className="mr-3" />
                Login
              </div>
            </button>
          </div>

          {/* Demo Video Button */}
          <div 
            className="animate-fade-in-up"
            style={{ animationDelay: '1s' }}
          >
            <button className="group inline-flex items-center text-blue-200 hover:text-white transition-colors duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mr-4 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                <FaPlay className="text-sm ml-1" />
              </div>
              <span className="text-lg font-medium">Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 transition-all duration-1000 delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {[
            { number: '10K+', label: 'Active Citizens' },
            { number: '5K+', label: 'Issues Resolved' },
            { number: '50+', label: 'Government Partners' },
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-blue-200 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
