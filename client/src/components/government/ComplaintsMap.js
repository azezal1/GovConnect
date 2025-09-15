import React, { useState, useEffect, useRef } from 'react';
import { FaFilter, FaEye, FaEdit, FaMapMarkerAlt, FaClock, FaExclamationTriangle, FaSpinner, FaCheckCircle } from 'react-icons/fa';
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
    fetchComplaints();
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

  const createCustomIcon = (status) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${getMarkerColor(status)}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Complaints Map</h1>
            <p className="text-gray-600">View and manage complaints across the city</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <span className="text-sm text-gray-600">Filters:</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredComplaints.length} of {complaints.length} complaints
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="h-96 w-full rounded-lg overflow-hidden">
          <MapContainer
            center={[20.5937, 78.9629]} // India center
            zoom={5}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {filteredComplaints.map((complaint) => {
              let location = null;
              
              // Parse location data - it might be stored as string or object
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
              
              // Check if we have valid coordinates
              if (location && (location.latitude || location.lat) && (location.longitude || location.lng)) {
                const lat = location.latitude || location.lat;
                const lng = location.longitude || location.lng;
                
                return (
                  <Marker
                    key={complaint.id}
                    position={[lat, lng]}
                    icon={createCustomIcon(complaint.status)}
                    eventHandlers={{
                      click: () => viewComplaintDetails(complaint)
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-medium text-gray-900 mb-1">{complaint.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{complaint.description.substring(0, 100)}...</p>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                            {complaint.status.replace('-', ' ')}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority}
                          </span>
                        </div>
                        <button
                          onClick={() => viewComplaintDetails(complaint)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Details
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

      {/* Complaint Details Modal */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Complaint Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {selectedComplaint.imageUrl && (
                  <img
                    src={selectedComplaint.imageUrl}
                    alt="Complaint"
                    className="w-full rounded-lg max-h-64 object-cover"
                  />
                )}

                <div>
                  <h3 className="font-medium text-gray-900">Title</h3>
                  <p className="text-gray-600">{selectedComplaint.title}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">Description</h3>
                  <p className="text-gray-600">{selectedComplaint.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Category</h3>
                    <p className="text-gray-600 capitalize">
                      {selectedComplaint.category.replace('-', ' ')}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Priority</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedComplaint.priority)}`}>
                      {selectedComplaint.priority}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Current Status</h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedComplaint.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedComplaint.status)}`}>
                        {selectedComplaint.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Submitted</h3>
                    <p className="text-gray-600">
                      {new Date(selectedComplaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedComplaint.location && (
                  <div>
                    <h3 className="font-medium text-gray-900">Location</h3>
                    <p className="text-gray-600">
                      {(() => {
                        let location = null;
                        try {
                          if (typeof selectedComplaint.location === 'string') {
                            location = JSON.parse(selectedComplaint.location);
                          } else {
                            location = selectedComplaint.location;
                          }
                          const lat = location.latitude || location.lat;
                          const lng = location.longitude || location.lng;
                          return `Lat: ${lat?.toFixed(6)}, Lng: ${lng?.toFixed(6)}`;
                        } catch (error) {
                          return 'Location data unavailable';
                        }
                      })()}
                    </p>
                  </div>
                )}

                {/* Status Update */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Update Status</h3>
                  <div className="flex items-center space-x-4">
                    <select
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    
                    <button
                      onClick={updateComplaintStatus}
                      disabled={updating || editingStatus === selectedComplaint.status}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updating ? 'Updating...' : 'Update Status'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsMap;
