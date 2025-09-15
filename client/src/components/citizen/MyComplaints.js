import React, { useState, useEffect } from 'react';
import { FaClock, FaExclamationTriangle, FaSpinner, FaCheckCircle, FaFilter, FaEye, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const MyComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('/api/citizen/complaints');
      setComplaints(response.data.complaints || []);
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

  const filteredComplaints = complaints.filter(complaint => {
    if (filter === 'all') return true;
    return complaint.status === filter;
  });

  const viewComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Complaints</h1>
            <p className="text-gray-600">Track the status of your reported issues</p>
          </div>
          
          {/* Filter */}
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <FaExclamationTriangle className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No complaints found</p>
            <p className="text-gray-400">Start by submitting a new complaint</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          {complaint.imageUrl && (
                            <img
                              src={complaint.imageUrl}
                              alt="Complaint"
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {complaint.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {complaint.description.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">
                          {complaint.category.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(complaint.status)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                            {complaint.status.replace('-', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewComplaintDetails(complaint)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          {complaint.status === 'pending' && (
                            <button
                              onClick={() => deleteComplaint(complaint.id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
                    <h3 className="font-medium text-gray-900">Status</h3>
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

                {selectedComplaint.resolutionNotes && (
                  <div>
                    <h3 className="font-medium text-gray-900">Resolution Notes</h3>
                    <p className="text-gray-600">{selectedComplaint.resolutionNotes}</p>
                  </div>
                )}

                {selectedComplaint.rewardPoints && (
                  <div>
                    <h3 className="font-medium text-gray-900">Reward Points Earned</h3>
                    <p className="text-green-600 font-semibold">{selectedComplaint.rewardPoints} points</p>
                  </div>
                )}
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

export default MyComplaints;
