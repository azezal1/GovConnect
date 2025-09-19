import React, { useEffect, useState } from 'react';
import { FaBuilding, FaUsers, FaHandshake, FaLightbulb, FaCheck, FaQuoteLeft } from 'react-icons/fa';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import Card from './shared/Card';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { number: '10,000+', label: 'Active Citizens', icon: FaUsers },
    { number: '5,000+', label: 'Issues Resolved', icon: FaCheck },
    { number: '50+', label: 'Government Partners', icon: FaHandshake },
    { number: '95%', label: 'Satisfaction Rate', icon: FaLightbulb },
  ];

  const timeline = [
    {
      year: '2023',
      title: 'Platform Launch',
      description: 'GovConnect was launched with basic complaint submission and tracking features.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      year: '2023',
      title: 'Government Integration',
      description: 'Partnered with 10+ government departments for direct complaint routing.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      year: '2024',
      title: 'Reward System',
      description: 'Introduced citizen reward points and gamification features.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      year: '2024',
      title: 'AI Analytics',
      description: 'Implemented AI-powered analytics for better issue categorization and routing.',
      color: 'from-orange-500 to-red-500'
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Chief Executive Officer',
      image: '/api/placeholder/150/150',
      bio: 'Former city planner with 15+ years in public administration.'
    },
    {
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      image: '/api/placeholder/150/150',
      bio: 'Tech entrepreneur focused on civic technology solutions.'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Head of Government Relations',
      image: '/api/placeholder/150/150',
      bio: 'PhD in Public Policy with expertise in digital governance.'
    },
    {
      name: 'David Kim',
      role: 'Lead Developer',
      image: '/api/placeholder/150/150',
      bio: 'Full-stack developer passionate about social impact technology.'
    },
  ];

  const testimonials = [
    {
      name: 'Mayor Jennifer Walsh',
      role: 'City of Springfield',
      quote: 'GovConnect has revolutionized how we handle citizen complaints. Response times have improved by 60%.',
      image: '/api/placeholder/80/80'
    },
    {
      name: 'Robert Martinez',
      role: 'Citizen User',
      quote: 'Finally, a platform where my voice is heard. I\'ve reported 5 issues and all were resolved within weeks.',
      image: '/api/placeholder/80/80'
    },
    {
      name: 'Lisa Thompson',
      role: 'Department Head',
      quote: 'The analytics dashboard helps us prioritize issues and allocate resources more effectively.',
      image: '/api/placeholder/80/80'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-medium mb-8">
              <FaBuilding className="mr-2" />
              About GovConnect
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Bridging the Gap Between
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Citizens & Government
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make civic engagement more accessible, transparent, and effective 
              through innovative technology solutions that connect communities with their governments.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-8 text-center" hover={true} gradient={true}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl mb-4">
                  <stat.icon className="text-2xl" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At GovConnect, we believe that effective governance starts with open communication 
                between citizens and their representatives. Our platform empowers communities to 
                report issues, track progress, and engage meaningfully with local government.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                By leveraging modern technology, we're making civic participation more accessible, 
                transparent, and rewarding for everyone involved.
              </p>
              
              <div className="space-y-4">
                {[
                  'Transparent communication channels',
                  'Real-time issue tracking',
                  'Data-driven decision making',
                  'Community engagement rewards'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-4" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-soft">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <FaUsers className="text-3xl text-blue-500 mb-4" />
                    <div className="text-2xl font-bold text-gray-900">10K+</div>
                    <div className="text-sm text-gray-600">Citizens</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <FaBuilding className="text-3xl text-green-500 mb-4" />
                    <div className="text-2xl font-bold text-gray-900">50+</div>
                    <div className="text-sm text-gray-600">Departments</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-soft col-span-2">
                    <FaHandshake className="text-3xl text-purple-500 mb-4" />
                    <div className="text-2xl font-bold text-gray-900">5,000+</div>
                    <div className="text-sm text-gray-600">Issues Resolved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a simple idea to a comprehensive civic engagement platform
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
            
            <div className="space-y-16">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <Card className="p-6" hover={true} gradient={true}>
                      <div className={`inline-block px-3 py-1 bg-gradient-to-r ${item.color} text-white text-sm font-bold rounded-full mb-4`}>
                        {item.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </Card>
                  </div>
                  
                  <div className="relative z-10 w-6 h-6 bg-white border-4 border-blue-500 rounded-full shadow-medium" />
                  
                  <div className="w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate professionals dedicated to improving civic engagement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center" hover={true} gradient={true}>
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaUsers className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What People Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from citizens and government officials who use GovConnect
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8" hover={true}>
                <FaQuoteLeft className="text-3xl text-blue-500 mb-6" />
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-4 flex items-center justify-center">
                    <FaUsers className="text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
