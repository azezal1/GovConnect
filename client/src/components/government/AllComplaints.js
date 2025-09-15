import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaTimes, FaUserPlus, FaClock, FaExclamationTriangle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all'
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [governmentOfficials, setGovernmentOfficials] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

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
    fetchGovernmentOfficials();
  }, [pagination.currentPage]);

  useEffect(() => {
    applyFilters();
  }, [complaints, filters, searchTerm]);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`/api/complaints?page=${pagination.currentPage}&limit=${pagination.itemsPerPage}`);
      setComplaints(response.data.complaints || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination?.totalPages || 1,
        totalItems: response.data.pagination?.totalItems || 0
      }));
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchGovernmentOfficials = async () => {
    try {
      const response = await axios.get('/api/complaints/government-officials');
      setGovernmentOfficials(response.data.officials || []);
    } catch (error) {
      console.error('Error fetching government officials:', error);
      toast.error('Failed to fetch government officials');
    }
  };

  const assignComplaint = async (complaintId, assignedTo) => {
    try {
      const response = await axios.patch(`/api/complaints/${complaintId}/assign`, {
        assignedTo: assignedTo || null
      });
      
      // Update the complaint in the local state
      setComplaints(prev => prev.map(complaint => 
        complaint.id === complaintId 
          ? { ...complaint, assignedTo: assignedTo || null }
          : complaint
      ));
      
      toast.success(assignedTo ? 'Complaint assigned successfully' : 'Complaint unassigned successfully');
    } catch (error) {
      console.error('Error assigning complaint:', error);
      toast.error('Failed to assign complaint');
    }
  };

  const applyFilters = () => {
    let filtered = complaints;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === filters.status);
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(complaint => complaint.category === filters.category);
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(complaint => complaint.priority === filters.priority);
    }

    setFilteredComplaints(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'verified': return <FaExclamationTriangle className="text-blue-500" />;
      case 'in_progress': return <FaSpinner className="text-orange-500" />;
      case 'resolved': return <FaCheckCircle className="text-green-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
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

  const formatLocation = (location) => {
    if (!location) return 'Location unavailable';
    
    try {
      const loc = typeof location === 'string' ? JSON.parse(location) : location;
      const lat = loc.latitude || loc.lat;
      const lng = loc.longitude || loc.lng;
      const address = loc.address;
      
      if (address && address !== 'Current location') {
        return address;
      }
      return `${lat?.toFixed(4)}, ${lng?.toFixed(4)}`;
    } catch (error) {
      return 'Location unavailable';
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
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
      {/* Header and Search/Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">All Complaints</h1>
            <p className="text-gray-600">Comprehensive view of all citizen complaints</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="text-sm text-gray-600">
              Showing {filteredComplaints.length} of {pagination.totalItems} complaints
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search complaints by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
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
              <option value="in_progress">In Progress</option>
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
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Complaint Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Citizen Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      {complaint.imageUrl && (
                        <div className="flex-shrink-0">
                          <img
                            src={complaint.imageUrl}
                            alt="Complaint"
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {complaint.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {complaint.description.length > 100 
                            ? `${complaint.description.substring(0, 100)}...` 
                            : complaint.description}
                        </p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {complaint.category.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(complaint.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                          {complaint.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span className="truncate max-w-32">
                        {formatLocation(complaint.location)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {complaint.isAnonymous ? (
                        <span className="text-gray-500 italic">Anonymous</span>
                      ) : (
                        <div>
                          <div className="flex items-center space-x-1">
                            <FaUser className="text-gray-400 text-xs" />
                            <span className="font-medium text-gray-900">
                              {complaint.user?.name || 'N/A'}
                            </span>
                          </div>
                          <div className="text-gray-500 text-xs mt-1">
                            {complaint.user?.email || 'N/A'}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <select
                        value={complaint.assignedTo || ''}
                        onChange={(e) => assignComplaint(complaint.id, e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Unassigned</option>
                        {governmentOfficials.map(official => (
                          <option key={official.id} value={official.id}>
                            {official.name}
                          </option>
                        ))}
                      </select>
                      {complaint.assignedTo && (
                        <div className="text-xs text-blue-600">
                          Assigned to: {governmentOfficials.find(o => o.id === complaint.assignedTo)?.name || 'Unknown'}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => viewComplaintDetails(complaint)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <FaEye className="mr-1" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pagination.currentPage
                          ? 'z-10 bg-green-50 border-green-500 text-green-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Complaint Details Modal */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Complaint Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Image and Basic Info */}
                <div className="space-y-6">
                  {selectedComplaint.imageUrl && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Complaint Image</h3>
                      <img
                        src={selectedComplaint.imageUrl}
                        alt="Complaint"
                        className="w-full rounded-lg max-h-80 object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Title</h3>
                    <p className="text-gray-600">{selectedComplaint.title}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedComplaint.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Category</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {selectedComplaint.category.replace('-', ' ')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Priority</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getPriorityColor(selectedComplaint.priority)}`}>
                        {selectedComplaint.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Status, Location, Citizen Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Current Status</h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedComplaint.status)}
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedComplaint.status)}`}>
                        {selectedComplaint.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                    <div className="flex items-start space-x-2">
                      <FaMapMarkerAlt className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-gray-600">{formatLocation(selectedComplaint.location)}</p>
                        {(() => {
                          try {
                            const loc = typeof selectedComplaint.location === 'string' 
                              ? JSON.parse(selectedComplaint.location) 
                              : selectedComplaint.location;
                            const lat = loc.latitude || loc.lat;
                            const lng = loc.longitude || loc.lng;
                            return lat && lng ? (
                              <p className="text-sm text-gray-500 mt-1">
                                Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
                              </p>
                            ) : null;
                          } catch (error) {
                            return null;
                          }
                        })()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Citizen Information</h3>
                    {selectedComplaint.isAnonymous ? (
                      <p className="text-gray-500 italic">Submitted anonymously</p>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <FaUser className="text-gray-400" />
                          <span className="text-gray-600">{selectedComplaint.user?.name || 'N/A'}</span>
                        </div>
                        <p className="text-gray-600">{selectedComplaint.user?.email || 'N/A'}</p>
                        <p className="text-gray-600">{selectedComplaint.user?.mobile || 'N/A'}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Submitted</h3>
                      <p className="text-gray-600">
                        {new Date(selectedComplaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedComplaint.resolvedAt && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Resolved</h3>
                        <p className="text-gray-600">
                          {new Date(selectedComplaint.resolvedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedComplaint.resolutionNotes && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Resolution Notes</h3>
                      <p className="text-gray-600">{selectedComplaint.resolutionNotes}</p>
                    </div>
                  )}

                  {/* Status Update Section */}
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-3">Update Status</h3>
                    <div className="flex items-center space-x-4">
                      <select
                        value={editingStatus}
                        onChange={(e) => setEditingStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="in_progress">In Progress</option>
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
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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

export default AllComplaints;
