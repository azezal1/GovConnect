import React, { useState, useEffect, useRef } from 'react';
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaCheckCircle, 
  FaSpinner, 
  FaExclamationTriangle,
  FaFilter,
  FaSearch,
  FaExpand,
  FaTimes
} from 'react-icons/fa';

const InteractiveMap = ({ complaints = [], onComplaintSelect, filters = {} }) => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  // const [mapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Delhi coordinates - removed unused
  // const [zoom] = useState(12); // Removed unused zoom state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animatedPins, setAnimatedPins] = useState(new Set());
  const mapRef = useRef(null);

  // Filter complaints based on current filters
  const filteredComplaints = complaints.filter(complaint => {
    if (filters.status && complaint.status !== filters.status) return false;
    if (filters.category && complaint.category !== filters.category) return false;
    if (filters.priority && complaint.priority !== filters.priority) return false;
    return true;
  });

  // Animate new pins when complaints change
  useEffect(() => {
    filteredComplaints.forEach((complaint, index) => {
      setTimeout(() => {
        setAnimatedPins(prev => new Set([...prev, complaint.id]));
      }, index * 100);
    });
  }, [filteredComplaints]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'verified': return '#3b82f6';
      case 'in_progress': return '#ef4444';
      case 'resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPrioritySize = (priority) => {
    switch (priority) {
      case 'critical': return 'w-6 h-6';
      case 'high': return 'w-5 h-5';
      case 'medium': return 'w-4 h-4';
      case 'low': return 'w-3 h-3';
      default: return 'w-4 h-4';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return FaClock;
      case 'verified': return FaExclamationTriangle;
      case 'in_progress': return FaSpinner;
      case 'resolved': return FaCheckCircle;
      default: return FaMapMarkerAlt;
    }
  };

  const handlePinClick = (complaint) => {
    setSelectedComplaint(complaint);
    onComplaintSelect?.(complaint);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Mock map implementation (in real app, you'd use Google Maps, Leaflet, etc.)
  const renderMapPins = () => {
    return filteredComplaints.map((complaint, index) => {
      const StatusIcon = getStatusIcon(complaint.status);
      const isAnimated = animatedPins.has(complaint.id);
      
      // Generate pseudo-random positions for demo
      const x = 20 + (index * 47) % 60;
      const y = 15 + (index * 31) % 70;

      return (
        <div
          key={complaint.id}
          className={`absolute cursor-pointer transform transition-all duration-500 hover:scale-125 ${
            isAnimated ? 'animate-bounce' : ''
          } ${selectedComplaint?.id === complaint.id ? 'z-20 scale-125' : 'z-10'}`}
          style={{ left: `${x}%`, top: `${y}%` }}
          onClick={() => handlePinClick(complaint)}
        >
          {/* Pin Shadow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-3 h-2 bg-black/20 rounded-full blur-sm" />
          
          {/* Animated Pulse Ring */}
          <div className={`absolute inset-0 rounded-full animate-ping ${getPrioritySize(complaint.priority)}`} 
               style={{ backgroundColor: `${getStatusColor(complaint.status)}40` }} />
          
          {/* Pin */}
          <div 
            className={`relative ${getPrioritySize(complaint.priority)} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:shadow-xl`}
            style={{ backgroundColor: getStatusColor(complaint.status) }}
          >
            <StatusIcon className="text-xs" />
          </div>

          {/* Tooltip */}
          {selectedComplaint?.id === complaint.id && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white rounded-lg shadow-xl border p-4 animate-fade-in-up">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">{complaint.title}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedComplaint(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-gray-600 mb-2">{complaint.description?.substring(0, 80)}...</p>
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-1 rounded-full font-medium ${
                  complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  complaint.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                  complaint.status === 'verified' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {complaint.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-gray-500">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={`relative bg-white rounded-xl shadow-soft overflow-hidden transition-all duration-300 ${
      isFullscreen ? 'fixed inset-4 z-50' : 'h-96'
    }`}>
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Complaints Map</h3>
            <p className="text-sm text-gray-600">{filteredComplaints.length} complaints shown</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaExpand className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 relative overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 40%, rgba(59, 130, 246, 0.05) 50%, transparent 60%)
          `
        }}
      >
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/svg%3E")`
        }} />

        {/* Mock City Areas */}
        <div className="absolute inset-0">
          {/* Central Business District */}
          <div className="absolute top-1/4 left-1/3 w-32 h-24 bg-gray-200/30 rounded-lg border border-gray-300/50" />
          <div className="absolute top-1/4 left-1/3 mt-1 ml-1 text-xs text-gray-600 font-medium">CBD</div>
          
          {/* Residential Area */}
          <div className="absolute top-1/2 right-1/4 w-40 h-32 bg-green-200/30 rounded-lg border border-green-300/50" />
          <div className="absolute top-1/2 right-1/4 mt-1 ml-1 text-xs text-gray-600 font-medium">Residential</div>
          
          {/* Industrial Zone */}
          <div className="absolute bottom-1/4 left-1/4 w-36 h-20 bg-orange-200/30 rounded-lg border border-orange-300/50" />
          <div className="absolute bottom-1/4 left-1/4 mt-1 ml-1 text-xs text-gray-600 font-medium">Industrial</div>
        </div>

        {/* Roads */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400/40" />
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-400/40" />
          <div className="absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-gray-400/30 transform rotate-45" />
        </div>

        {/* Complaint Pins */}
        {renderMapPins()}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-soft">
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Status Legend</h4>
          <div className="space-y-1">
            {[
              { status: 'pending', label: 'Pending', color: '#f59e0b' },
              { status: 'verified', label: 'Verified', color: '#3b82f6' },
              { status: 'in_progress', label: 'In Progress', color: '#ef4444' },
              { status: 'resolved', label: 'Resolved', color: '#10b981' }
            ].map(({ status, label, color }) => (
              <div key={status} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Overlay */}
        <div className="absolute top-16 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-soft">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{filteredComplaints.length}</div>
            <div className="text-xs text-gray-600">Active Complaints</div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {filteredComplaints.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-center">
            <FaMapMarkerAlt className="text-4xl text-gray-400 mb-2 mx-auto" />
            <p className="text-gray-600">No complaints to display</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
