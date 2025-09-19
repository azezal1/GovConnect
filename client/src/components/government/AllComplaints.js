import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUser, 
  FaTimes, 
  FaUserPlus, 
  FaClock, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaSpinner,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChartBar,
  FaFileAlt,
  FaArrowUp,
  FaArrowDown,
  FaEquals,
  FaExclamationCircle,
  FaPlay,
  FaStop,
  FaEdit,
  FaTrash,
  FaDownload,
  FaShare,
  FaFlag,
  FaHeart,
  FaStar
} from 'react-icons/fa';
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
  
  // Modern UI states
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
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
    setIsVisible(true);
    fetchComplaints();
    fetchGovernmentOfficials();
    
    // Generate floating elements for background animation
    const elements = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 20,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15,
    }));
    setFloatingElements(elements);
  }, [pagination.currentPage]);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [complaints, filters, searchTerm, sortBy, sortOrder]);

  const calculateStats = () => {
    const total = filteredComplaints.length;
    const pending = filteredComplaints.filter(c => c.status === 'pending').length;
    const inProgress = filteredComplaints.filter(c => c.status === 'in_progress').length;
    const resolved = filteredComplaints.filter(c => c.status === 'resolved').length;
    
    setStats({ total, pending, inProgress, resolved });
  };

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

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredComplaints(filtered);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="text-gray-400" />;
    return sortOrder === 'asc' ? <FaSortUp className="text-emerald-500" /> : <FaSortDown className="text-emerald-500" />;
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 flex items-center space-x-4">
          <FaSpinner className="text-3xl text-emerald-600 animate-spin" />
          <span className="text-xl text-gray-700">Loading Complaints...</span>
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
                    Complaints Dashboard
                  </h1>
                  <p className="text-gray-600 text-lg">Monitor and manage citizen complaints efficiently</p>
                </div>
                
                <div className="mt-6 lg:mt-0 flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                    <span className="text-gray-700 font-medium">
                      {filteredComplaints.length} of {pagination.totalItems} complaints
                    </span>
                  </div>
                  
                  {/* View Mode Toggle */}
                  <div className="flex bg-white/20 backdrop-blur-md rounded-xl p-1 border border-white/20">
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        viewMode === 'cards' 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <FaFileAlt className="inline mr-2" />
                      Cards
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        viewMode === 'table' 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <FaChartBar className="inline mr-2" />
                      Table
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Complaints', value: stats.total, icon: FaFileAlt, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Pending Review', value: stats.pending, icon: FaClock, color: 'from-yellow-500 to-orange-500' },
                  { label: 'In Progress', value: stats.inProgress, icon: FaPlay, color: 'from-orange-500 to-red-500' },
                  { label: 'Resolved', value: stats.resolved, icon: FaCheckCircle, color: 'from-green-500 to-emerald-500' }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={stat.label}
                      className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="text-white text-xl" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                      <div className="text-gray-600 text-sm">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 lg:mb-0">Search & Filter</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <FaFilter />
                <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-md border-2 border-white/20 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-400 transition-all duration-300"
              />
            </div>

            {/* Filter Controls */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
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
                    <option value="in_progress">In Progress</option>
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
            )}
          </div>

          {/* Complaints Display */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComplaints.map((complaint, index) => (
                <div 
                  key={complaint.id}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in-up group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(complaint.status)}
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </div>

                  {/* Image */}
                  {complaint.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={complaint.imageUrl}
                        alt="Complaint"
                        className="w-full h-32 object-cover rounded-xl"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{complaint.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{complaint.description}</p>
                  </div>

                  {/* Category */}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {complaint.category.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => viewComplaintDetails(complaint)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <FaEye />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-white/20 backdrop-blur-md">
                    <tr>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors duration-200"
                        onClick={() => handleSort('title')}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Complaint</span>
                          {getSortIcon('title')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors duration-200"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Status</span>
                          {getSortIcon('status')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors duration-200"
                        onClick={() => handleSort('priority')}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Priority</span>
                          {getSortIcon('priority')}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Location
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors duration-200"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Date</span>
                          {getSortIcon('createdAt')}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredComplaints.map((complaint, index) => (
                      <tr 
                        key={complaint.id} 
                        className="hover:bg-white/5 transition-all duration-200 animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-4">
                            {complaint.imageUrl && (
                              <img
                                src={complaint.imageUrl}
                                alt="Complaint"
                                className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {complaint.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {complaint.description}
                              </p>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                                {complaint.category.replace('-', ' ')}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(complaint.status)}
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                              {complaint.status.replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority}
                          </span>
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
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <FaCalendarAlt className="text-gray-400" />
                            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => viewComplaintDetails(complaint)}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                          >
                            <FaEye />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllComplaints;
