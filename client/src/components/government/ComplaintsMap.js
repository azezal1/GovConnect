import React, { useState, useEffect, useRef } from 'react';
import { 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaMapMarkerAlt, 
  FaClock, 
  FaExclamationTriangle, 
  FaSpinner, 
  FaCheckCircle,
  FaLayerGroup,
  FaSearchLocation,
  FaExpand,
  FaCompress,
  FaDownload,
  FaShare,
  FaLocationArrow,
  FaGlobe,
  FaSatellite,
  FaRoad
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ComplaintsMap = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all'
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  
  // Modern UI states
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const [mapStyle, setMapStyle] = useState('street');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [animatedPins, setAnimatedPins] = useState(true);
  const [clusterView, setClusterView] = useState(false);

  const categories = [
    'admin',
    'it-section',
    'urban-livelihood',
    'elections',
    'finance',
    'planning',
    'public-health',
    'revenue',
    'engineering'
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical', color: 'text-red-600' }
  ];

  useEffect(() => {
    setIsVisible(true);
    fetchComplaints();
    
    // Generate floating elements for background animation
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 50 + 25,
      delay: Math.random() * 5,
      duration: Math.random() * 15 + 20,
    }));
    setFloatingElements(elements);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [complaints, filters]);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('/api/complaints');
      setComplaints(response.data.complaints || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = complaints;

    if (filters.status !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === filters.status);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(complaint => complaint.category === filters.category);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(complaint => complaint.priority === filters.priority);
    }

    setFilteredComplaints(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'verified': return <FaExclamationTriangle className="text-blue-500" />;
      case 'in-progress': return <FaSpinner className="text-orange-500" />;
      case 'resolved': return <FaCheckCircle className="text-green-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMarkerColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'verified': return '#3b82f6';
      case 'in-progress': return '#f97316';
      case 'resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  const createCustomIcon = (status, priority = 'medium') => {
    const color = getMarkerColor(status);
    const pulseAnimation = animatedPins ? 'animate-pulse' : '';
    const prioritySize = priority === 'critical' ? '28px' : priority === 'high' ? '24px' : '20px';
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="relative ${pulseAnimation}">
          <div style="
            background: linear-gradient(135deg, ${color}, ${color}dd);
            width: ${prioritySize}; 
            height: ${prioritySize}; 
            border-radius: 50%; 
            border: 3px solid white; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 4px ${color}33;
            position: relative;
            z-index: 10;
          "></div>
          ${animatedPins ? `
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: ${parseInt(prioritySize) + 10}px;
              height: ${parseInt(prioritySize) + 10}px;
              border: 2px solid ${color};
              border-radius: 50%;
              animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          ` : ''}
        </div>
      `,
      iconSize: [parseInt(prioritySize) + 10, parseInt(prioritySize) + 10],
      iconAnchor: [(parseInt(prioritySize) + 10) / 2, (parseInt(prioritySize) + 10) / 2]
    });
  };

  const getMapTileUrl = () => {
    switch (mapStyle) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const viewComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setEditingStatus(complaint.status);
    setShowModal(true);
  };

  const updateComplaintStatus = async () => {
    if (!selectedComplaint || !editingStatus) return;

    setUpdating(true);
    try {
      await axios.patch(`/api/complaints/${selectedComplaint.id}/status`, {
        status: editingStatus
      });
      
      toast.success('Complaint status updated successfully');
      fetchComplaints();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating complaint status:', error);
      toast.error('Failed to update complaint status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 flex items-center space-x-4">
          <FaSpinner className="text-3xl text-emerald-600 animate-spin" />
          <span className="text-xl text-gray-700">Loading Map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-gradient-to-r from-emerald-400/10 to-teal-400/10 animate-float"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 p-6 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Modern Header */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden">
            {/* Background Gradient Orb */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                    Interactive Complaints Map
                  </h1>
                  <p className="text-gray-600 text-lg">Visualize and manage complaints across the city</p>
                </div>
                
                <div className="mt-6 lg:mt-0 flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                    <span className="text-gray-700 font-medium">
                      {filteredComplaints.length} complaints on map
                    </span>
                  </div>
                </div>
              </div>

              {/* Map Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4">
                  {/* Map Style Toggle */}
                  <div className="flex bg-white/20 backdrop-blur-md rounded-xl p-1 border border-white/20">
                    {[
                      { id: 'street', label: 'Street', icon: FaRoad },
                      { id: 'satellite', label: 'Satellite', icon: FaSatellite },
                      { id: 'terrain', label: 'Terrain', icon: FaGlobe }
                    ].map((style) => {
                      const Icon = style.icon;
                      return (
                        <button
                          key={style.id}
                          onClick={() => setMapStyle(style.id)}
                          className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                            mapStyle === style.id 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
                        >
                          <Icon />
                          <span className="hidden md:inline">{style.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Animation Toggle */}
                  <button
                    onClick={() => setAnimatedPins(!animatedPins)}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                      animatedPins 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                        : 'bg-white/20 text-gray-600 hover:bg-white/30'
                    }`}
                  >
                    <FaLocationArrow />
                    <span className="hidden md:inline">Animated Pins</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <FaFilter />
                    <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                  </button>
                  
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="px-4 py-2 bg-white/20 backdrop-blur-md text-gray-700 rounded-xl hover:bg-white/30 transition-all duration-300"
                  >
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6 animate-fade-in-up">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Filter Complaints</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border-2 border-white/20 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border-2 border-white/20 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border-2 border-white/20 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                  >
                    <option value="all">All Priorities</option>
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Map */}
          <div className={`bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden transition-all duration-500 ${
            isFullscreen ? 'fixed inset-4 z-50' : 'relative'
          }`}>
            <div className={`${isFullscreen ? 'h-full' : 'h-96 lg:h-[600px]'} w-full relative`}>
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                style={{ height: '100%', width: '100%', borderRadius: isFullscreen ? '0' : '1.5rem' }}
                className="z-10"
              >
                <TileLayer
                  url={getMapTileUrl()}
                  attribution='&copy; Map contributors'
                />
                
                {filteredComplaints.map((complaint, index) => {
                  let location = null;
                  
                  if (complaint.location) {
                    try {
                      if (typeof complaint.location === 'string') {
                        location = JSON.parse(complaint.location);
                      } else {
                        location = complaint.location;
                      }
                    } catch (error) {
                      console.error('Error parsing location:', error);
                      return null;
                    }
                  }
                  
                  if (location && (location.latitude || location.lat) && (location.longitude || location.lng)) {
                    const lat = location.latitude || location.lat;
                    const lng = location.longitude || location.lng;
                    
                    return (
                      <Marker
                        key={complaint.id}
                        position={[lat, lng]}
                        icon={createCustomIcon(complaint.status, complaint.priority)}
                        eventHandlers={{
                          click: () => viewComplaintDetails(complaint)
                        }}
                      >
                        <Popup className="custom-popup">
                          <div className="p-4 min-w-64">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-bold text-gray-900 text-lg">{complaint.title}</h3>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(complaint.status)}
                              </div>
                            </div>
                            
                            {complaint.imageUrl && (
                              <img
                                src={complaint.imageUrl}
                                alt="Complaint"
                                className="w-full h-32 object-cover rounded-lg mb-3"
                              />
                            )}
                            
                            <p className="text-gray-600 mb-3 line-clamp-3">{complaint.description}</p>
                            
                            <div className="flex items-center justify-between mb-4">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                                {complaint.status.replace('_', ' ')}
                              </span>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                                {complaint.priority}
                              </span>
                            </div>
                            
                            <button
                              onClick={() => viewComplaintDetails(complaint)}
                              className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                              <FaEye />
                              <span>View Details</span>
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  }
                  return null;
                })}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsMap;
