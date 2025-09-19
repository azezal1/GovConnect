import React, { useEffect, useRef, useState } from 'react';
import { 
  FaMapMarkedAlt, 
  FaChartLine, 
  FaShieldAlt, 
  FaUsers, 
  FaMobile, 
  FaClock,
  FaAward,
  FaGlobe
} from 'react-icons/fa';
import Card from './Card';

const Features = () => {
  const [visibleFeatures, setVisibleFeatures] = useState(new Set());
  const featuresRef = useRef([]);

  const features = [
    {
      icon: <FaMapMarkedAlt className="text-4xl text-blue-500" />,
      title: "Geotagged Reports",
      description: "Submit complaints with precise location data using GPS coordinates for faster and more accurate resolution by authorities.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaChartLine className="text-4xl text-green-500" />,
      title: "Real-time Analytics",
      description: "Track complaint trends, resolution statistics, and community impact with interactive dashboards and detailed insights.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <FaShieldAlt className="text-4xl text-purple-500" />,
      title: "Secure Platform",
      description: "End-to-end encrypted data transmission with secure authentication and privacy protection for all users.",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: <FaUsers className="text-4xl text-orange-500" />,
      title: "Citizen Rewards",
      description: "Earn points for valid reports, track your community contribution, and unlock achievements for civic participation.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <FaMobile className="text-4xl text-pink-500" />,
      title: "Mobile Optimized",
      description: "Fully responsive design works seamlessly across all devices - desktop, tablet, and mobile for on-the-go reporting.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <FaClock className="text-4xl text-indigo-500" />,
      title: "24/7 Monitoring",
      description: "Round-the-clock system monitoring ensures your complaints are processed quickly and efficiently at any time.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: <FaAward className="text-4xl text-yellow-500" />,
      title: "Recognition System",
      description: "Get recognized for your contributions with badges, leaderboards, and community appreciation features.",
      color: "from-yellow-500 to-amber-500"
    },
    {
      icon: <FaGlobe className="text-4xl text-teal-500" />,
      title: "Multi-Language",
      description: "Available in multiple languages to serve diverse communities and ensure accessibility for all citizens.",
      color: "from-teal-500 to-cyan-500"
    }
  ];

  useEffect(() => {
    const observers = featuresRef.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleFeatures(prev => new Set([...prev, index]));
            }, index * 100);
          }
        },
        { threshold: 0.1 }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Platform Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> GovConnect</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive platform streamlines civic engagement with cutting-edge technology, 
            making it easier than ever to report issues, track progress, and build stronger communities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => featuresRef.current[index] = el}
              className={`transition-all duration-700 ${
                visibleFeatures.has(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card 
                className="p-6 h-full group hover:shadow-glow"
                hover={true}
                gradient={true}
              >
                {/* Icon with Gradient Background */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Line */}
                <div className={`w-0 h-1 bg-gradient-to-r ${feature.color} mt-4 group-hover:w-full transition-all duration-500`} />
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-glass max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of citizens already using GovConnect to improve their communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:shadow-glow hover:scale-105">
                Start Reporting Issues
              </button>
              <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
