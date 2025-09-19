import React, { useState, useEffect } from 'react';
import { 
  FaClock, 
  FaExclamationTriangle, 
  FaSpinner, 
  FaCheckCircle, 
  FaEye, 
  FaTrash,
  FaCalendarAlt,
  FaTimes,
  FaImage,
  FaAward,
  FaPlus
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Card from '../shared/Card';
import AnimatedButton from '../shared/AnimatedButton';
import EnhancedSearch from './EnhancedSearch';
import RewardProgress from './RewardProgress';

const MyComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    totalPoints: 0
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('/api/citizen/complaints');
      const complaintsData = response.data.complaints || [];
      setComplaints(complaintsData);
      
      // Calculate stats
      const resolvedCount = complaintsData.filter(c => c.status === 'resolved').length;
      const totalPoints = complaintsData.reduce((sum, c) => sum + (c.rewardPoints || 0), 0);
      
      setStats({
        totalComplaints: complaintsData.length,
        resolvedComplaints: resolvedCount,
        totalPoints: totalPoints
      });
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const deleteComplaint = async (complaintId) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) {
      return;
    }

    try {
      await axios.delete(`/api/complaints/${complaintId}`);
      toast.success('Complaint deleted successfully');
      fetchComplaints();
    } catch (error) {
      console.error('Error deleting complaint:', error);
      toast.error('Failed to delete complaint');
    }
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

  // Filter and search logic
  useEffect(() => {
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
    if (activeFilters.status) {
      filtered = filtered.filter(complaint => complaint.status === activeFilters.status);
    }

    // Apply category filter
    if (activeFilters.category) {
      filtered = filtered.filter(complaint => complaint.category === activeFilters.category);
    }

    // Apply priority filter
    if (activeFilters.priority) {
      filtered = filtered.filter(complaint => complaint.priority === activeFilters.priority);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        default:
          return 0;
      }
    });

    setFilteredComplaints(filtered);
  }, [complaints, searchTerm, activeFilters, sortBy]);

  const viewComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft mb-4">
            <FaSpinner className="text-3xl text-blue-500 animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading your complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 relative overflow-hidden" hover={false}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Complaints</h1>
              <p className="text-blue-200 text-lg">Track and manage your reported issues</p>
            </div>
            
            <div className="hidden lg:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.totalComplaints}</div>
                <div className="text-blue-200">Total Reports</div>
              </div>
              <AnimatedButton
                onClick={() => navigate('/citizen/submit')}
                variant="ghost"
                icon={FaPlus}
                className="text-white border-white/30 hover:bg-white/10"
              >
                New Complaint
              </AnimatedButton>
            </div>
          </div>
        </Card>

        {/* Reward Progress Section */}
        <RewardProgress 
          currentPoints={stats.totalPoints}
          totalComplaints={stats.totalComplaints}
          resolvedComplaints={stats.resolvedComplaints}
        />

        {/* Search and Filter Section */}
        <EnhancedSearch
          onSearch={setSearchTerm}
          onFilter={setActiveFilters}
          onSort={setSortBy}
          totalCount={filteredComplaints.length}
        />

        {/* Complaints Grid */}
        {filteredComplaints.length === 0 ? (
          <Card className="p-12 text-center" hover={false}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-6">
              <FaExclamationTriangle className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(activeFilters).some(v => v) 
                ? 'Try adjusting your search or filters' 
                : 'Start by submitting your first complaint'
              }
            </p>
            <AnimatedButton
              onClick={() => navigate('/citizen/submit')}
              variant="primary"
              icon={FaPlus}
            >
              Submit New Complaint
            </AnimatedButton>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint, index) => (
              <Card 
                key={complaint.id} 
                className="p-6 hover-lift cursor-pointer relative overflow-hidden animate-fade-in-up"
                hover={true}
                gradient={true}
                onClick={() => viewComplaintDetails(complaint)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Status Indicator */}
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  complaint.status === 'resolved' ? 'bg-green-500' :
                  complaint.status === 'in-progress' ? 'bg-orange-500' :
                  complaint.status === 'verified' ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`} />

                {/* Image */}
                {complaint.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={complaint.imageUrl}
                      alt="Complaint"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                      {complaint.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {complaint.description}
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <FaCalendarAlt className="w-3 h-3" />
                      <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className="text-gray-600 capitalize">
                      {complaint.category.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Status and Priority */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(complaint.status)}
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                        {complaint.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority.toUpperCase()}
                    </span>
                  </div>

                  {/* Reward Points */}
                  {complaint.rewardPoints && (
                    <div className="flex items-center justify-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3">
                      <FaAward className="text-yellow-500 mr-2" />
                      <span className="text-yellow-700 font-semibold">
                        +{complaint.rewardPoints} points earned
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <AnimatedButton
                      onClick={(e) => {
                        e.stopPropagation();
                        viewComplaintDetails(complaint);
                      }}
                      variant="ghost"
                      size="sm"
                      icon={FaEye}
                    >
                      View Details
                    </AnimatedButton>
                    
                    {complaint.status === 'pending' && (
                      <AnimatedButton
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteComplaint(complaint.id);
                        }}
                        variant="ghost"
                        size="sm"
                        icon={FaTrash}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </AnimatedButton>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Modal */}
        {showModal && selectedComplaint && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Complaint Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {selectedComplaint.imageUrl && (
                      <div className="relative">
                        <img
                          src={selectedComplaint.imageUrl}
                          alt="Complaint"
                          className="w-full rounded-2xl shadow-soft max-h-80 object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-2">
                          <FaImage className="text-gray-600" />
                        </div>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                      <h3 className="font-bold text-gray-900 text-xl mb-2">{selectedComplaint.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{selectedComplaint.description}</p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/80 rounded-xl p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                        <p className="text-gray-600 capitalize">
                          {selectedComplaint.category.replace('-', ' ')}
                        </p>
                      </div>
                      <div className="bg-white/80 rounded-xl p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Priority</h4>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(selectedComplaint.priority)}`}>
                          {selectedComplaint.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/80 rounded-xl p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Status</h4>
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(selectedComplaint.status)}
                        <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(selectedComplaint.status)}`}>
                          {selectedComplaint.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/80 rounded-xl p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Submitted</h4>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaCalendarAlt className="w-4 h-4" />
                        <span>{new Date(selectedComplaint.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {selectedComplaint.rewardPoints && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Reward Points</h4>
                        <div className="flex items-center space-x-2">
                          <FaAward className="text-yellow-500" />
                          <span className="text-yellow-700 font-bold">+{selectedComplaint.rewardPoints} points</span>
                        </div>
                      </div>
                    )}

                    {selectedComplaint.resolutionNotes && (
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Resolution Notes</h4>
                        <p className="text-green-700">{selectedComplaint.resolutionNotes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <AnimatedButton
                    onClick={() => setShowModal(false)}
                    variant="outline"
                  >
                    Close
                  </AnimatedButton>
                  {selectedComplaint.status === 'pending' && (
                    <AnimatedButton
                      onClick={() => {
                        deleteComplaint(selectedComplaint.id);
                        setShowModal(false);
                      }}
                      variant="danger"
                      icon={FaTrash}
                    >
                      Delete Complaint
                    </AnimatedButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyComplaints;
