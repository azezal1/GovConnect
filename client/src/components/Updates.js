import React, { useState, useEffect } from 'react';
import { 
  FaNewspaper, 
  FaCalendarAlt, 
  FaUser, 
  FaTag, 
  FaArrowRight,
  FaSearch,
  FaFilter,
  FaBullhorn,
  FaCog,
  FaAward
} from 'react-icons/fa';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import Card from './shared/Card';
import Button from './shared/Button';

const Updates = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUpdates, setFilteredUpdates] = useState([]);

  const categories = [
    { id: 'all', name: 'All Updates', icon: FaNewspaper, color: 'from-blue-500 to-cyan-500' },
    { id: 'announcements', name: 'Announcements', icon: FaBullhorn, color: 'from-green-500 to-emerald-500' },
    { id: 'features', name: 'New Features', icon: FaCog, color: 'from-purple-500 to-pink-500' },
    { id: 'achievements', name: 'Achievements', icon: FaAward, color: 'from-orange-500 to-red-500' },
  ];

  const updates = [
    {
      id: 1,
      title: "New AI-Powered Issue Categorization",
      excerpt: "We've implemented advanced AI to automatically categorize and route complaints to the appropriate departments, reducing response times by 40%.",
      content: "Our new AI system uses machine learning to analyze complaint descriptions and automatically assign them to the most relevant government department. This breakthrough technology has already improved our response times significantly.",
      category: "features",
      author: "Tech Team",
      date: "2024-01-15",
      readTime: "3 min read",
      image: "/api/placeholder/400/250",
      tags: ["AI", "Technology", "Efficiency"]
    },
    {
      id: 2,
      title: "Partnership with 10 New Government Departments",
      excerpt: "GovConnect now integrates with 10 additional government departments, expanding our reach and improving service delivery across the city.",
      content: "We're excited to announce partnerships with 10 new government departments, including Parks & Recreation, Public Works, and Environmental Services. This expansion means faster, more direct routing of citizen complaints.",
      category: "announcements",
      author: "Partnership Team",
      date: "2024-01-10",
      readTime: "2 min read",
      image: "/api/placeholder/400/250",
      tags: ["Partnership", "Government", "Expansion"]
    },
    {
      id: 3,
      title: "Mobile App Now Available",
      excerpt: "Download our new mobile app for iOS and Android to report issues on the go with enhanced GPS integration and offline capabilities.",
      content: "Our mobile app brings all the power of GovConnect to your smartphone. With enhanced GPS integration, camera functionality, and offline capabilities, reporting civic issues has never been easier.",
      category: "features",
      author: "Mobile Team",
      date: "2024-01-05",
      readTime: "4 min read",
      image: "/api/placeholder/400/250",
      tags: ["Mobile", "App", "GPS"]
    },
    {
      id: 4,
      title: "5,000 Issues Successfully Resolved",
      excerpt: "We've reached a major milestone with over 5,000 civic issues resolved through our platform, making communities safer and cleaner.",
      content: "Thanks to the dedication of our users and government partners, we've successfully facilitated the resolution of over 5,000 civic issues. From pothole repairs to streetlight fixes, every resolved issue makes our communities better.",
      category: "achievements",
      author: "Community Team",
      date: "2024-01-01",
      readTime: "2 min read",
      image: "/api/placeholder/400/250",
      tags: ["Milestone", "Community", "Success"]
    },
    {
      id: 5,
      title: "Enhanced Security Measures Implemented",
      excerpt: "New security protocols and end-to-end encryption ensure your data remains safe and private while using our platform.",
      content: "We've implemented advanced security measures including end-to-end encryption, two-factor authentication, and regular security audits to protect user data and maintain platform integrity.",
      category: "announcements",
      author: "Security Team",
      date: "2023-12-28",
      readTime: "3 min read",
      image: "/api/placeholder/400/250",
      tags: ["Security", "Privacy", "Encryption"]
    },
    {
      id: 6,
      title: "Real-time Notification System Launch",
      excerpt: "Stay updated with instant notifications about your complaint status, government responses, and resolution updates.",
      content: "Our new real-time notification system keeps you informed every step of the way. Receive instant updates via email, SMS, or push notifications when there's progress on your complaints.",
      category: "features",
      author: "Product Team",
      date: "2023-12-20",
      readTime: "2 min read",
      image: "/api/placeholder/400/250",
      tags: ["Notifications", "Real-time", "Updates"]
    }
  ];

  useEffect(() => {
    let filtered = updates;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(update => update.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(update => 
        update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredUpdates(filtered);
  }, [selectedCategory, searchTerm]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

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
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-medium mb-8">
            <FaNewspaper className="mr-2" />
            Latest Updates
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            News &
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Updates
            </span>
          </h1>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Stay informed about the latest features, partnerships, and improvements 
            to the GovConnect platform.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search updates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-glow`
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <category.icon className="mr-2" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Updates Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredUpdates.length === 0 ? (
            <div className="text-center py-16">
              <FaSearch className="text-6xl text-gray-300 mb-6 mx-auto" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Updates Found</h3>
              <p className="text-gray-600 mb-8">
                Try adjusting your search terms or category filter.
              </p>
              <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Featured Update */}
              {filteredUpdates.length > 0 && (
                <div className="mb-16">
                  <Card className="overflow-hidden" hover={true}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="p-8">
                        <div className="flex items-center mb-4">
                          <span className={`inline-flex items-center px-3 py-1 bg-gradient-to-r ${getCategoryInfo(filteredUpdates[0].category).color} text-white text-sm font-medium rounded-full mr-4`}>
                            {React.createElement(getCategoryInfo(filteredUpdates[0].category).icon, { className: "mr-1" })}
                            {getCategoryInfo(filteredUpdates[0].category).name}
                          </span>
                          <span className="text-sm text-gray-500">Featured</span>
                        </div>
                        
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                          {filteredUpdates[0].title}
                        </h2>
                        
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                          {filteredUpdates[0].excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center text-sm text-gray-500">
                            <FaUser className="mr-2" />
                            {filteredUpdates[0].author}
                            <FaCalendarAlt className="ml-4 mr-2" />
                            {formatDate(filteredUpdates[0].date)}
                          </div>
                          <span className="text-sm text-gray-500">{filteredUpdates[0].readTime}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {filteredUpdates[0].tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                              <FaTag className="mr-1 inline" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <Button icon={<FaArrowRight />} iconPosition="right">
                          Read More
                        </Button>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 flex items-center justify-center">
                        <div className="w-full h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                          <FaNewspaper className="text-6xl text-white" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Updates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredUpdates.slice(1).map((update) => (
                  <Card key={update.id} className="overflow-hidden" hover={true}>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center h-48">
                      {React.createElement(getCategoryInfo(update.category).icon, { className: "text-5xl text-blue-500" })}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className={`inline-flex items-center px-2 py-1 bg-gradient-to-r ${getCategoryInfo(update.category).color} text-white text-xs font-medium rounded-full`}>
                          {React.createElement(getCategoryInfo(update.category).icon, { className: "mr-1" })}
                          {getCategoryInfo(update.category).name}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {update.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {update.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <FaUser className="mr-1" />
                          {update.author}
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {formatDate(update.date)}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {update.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                        {update.tags.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{update.tags.length - 2}
                          </span>
                        )}
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full">
                        Read More
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="p-12" glass={true}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Stay Updated
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive the latest updates, feature announcements, 
              and community news directly in your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <Button icon={<FaArrowRight />} iconPosition="right">
                Subscribe
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Updates;
