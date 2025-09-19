import React, { useEffect, useRef, useState } from 'react';
import { FaCamera, FaMapMarkerAlt, FaEye, FaGift, FaArrowRight } from 'react-icons/fa';

const HowItWorks = () => {
  const [visibleSteps, setVisibleSteps] = useState(new Set());
  const stepsRef = useRef([]);

  const steps = [
    {
      number: "01",
      icon: <FaCamera className="text-3xl" />,
      title: "Report Issue",
      description: "Take a photo, add description, and tag location using our intuitive mobile-friendly interface with GPS integration.",
      details: ["Upload photos/videos", "Add detailed description", "Auto-detect GPS location", "Select issue category"],
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      number: "02",
      icon: <FaEye className="text-3xl" />,
      title: "Track Progress",
      description: "Monitor your complaint status from pending to resolved in real-time with automated notifications and updates.",
      details: ["Real-time status updates", "Push notifications", "Government response tracking", "Resolution timeline"],
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      number: "03",
      icon: <FaGift className="text-3xl" />,
      title: "Earn Rewards",
      description: "Get points for valid reports, unlock achievements, and contribute to building a better community together.",
      details: ["Points for valid reports", "Achievement badges", "Community leaderboard", "Recognition system"],
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    }
  ];

  useEffect(() => {
    const observers = stepsRef.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleSteps(prev => new Set([...prev, index]));
            }, index * 200);
          }
        },
        { threshold: 0.2 }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-r from-green-100 to-blue-100 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-600 text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Three simple steps to make your city better. Our streamlined process ensures 
            your voice is heard and your community issues are resolved efficiently.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={el => stepsRef.current[index] = el}
              className={`transition-all duration-1000 ${
                visibleSteps.has(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
            >
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                {/* Content */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center mb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${step.color} text-white rounded-2xl mr-4 shadow-glow`}>
                      {step.icon}
                    </div>
                    <div className="text-6xl font-bold text-gray-100">
                      {step.number}
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-gray-700">
                        <div className={`w-2 h-2 bg-gradient-to-r ${step.color} rounded-full mr-3`} />
                        {detail}
                      </li>
                    ))}
                  </ul>

                  {index < steps.length - 1 && (
                    <div className="flex items-center mt-8 lg:hidden">
                      <div className={`flex-1 h-0.5 bg-gradient-to-r ${step.color}`} />
                      <FaArrowRight className={`mx-4 text-2xl bg-gradient-to-r ${step.color} bg-clip-text text-transparent`} />
                      <div className="flex-1" />
                    </div>
                  )}
                </div>

                {/* Visual */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className={`relative bg-gradient-to-br ${step.bgColor} rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-300`}>
                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/50 rounded-full blur-xl" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/30 rounded-full blur-lg" />
                    
                    {/* Main Visual Content */}
                    <div className="relative z-10 text-center">
                      <div className={`inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r ${step.color} text-white rounded-3xl mb-6 shadow-glow animate-float`}>
                        <div className="text-5xl">
                          {step.icon}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Mock UI Elements */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-soft">
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-20 h-3 bg-gray-200 rounded-full" />
                            <div className={`w-16 h-3 bg-gradient-to-r ${step.color} rounded-full`} />
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full">
                            <div className={`h-2 bg-gradient-to-r ${step.color} rounded-full transition-all duration-1000 ${
                              visibleSteps.has(index) ? 'w-3/4' : 'w-0'
                            }`} />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 h-16" />
                          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 h-16" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection Line for Desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex justify-center mt-16">
                  <div className="flex items-center">
                    <div className={`w-32 h-0.5 bg-gradient-to-r ${step.color}`} />
                    <FaArrowRight className={`mx-4 text-2xl bg-gradient-to-r ${step.color} bg-clip-text text-transparent animate-bounce-gentle`} />
                    <div className={`w-32 h-0.5 bg-gradient-to-r ${steps[index + 1].color}`} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-1 shadow-glow max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 mb-6">
                Join our community and start making a difference in your neighborhood today.
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:shadow-glow hover:scale-105">
                Begin Your Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
