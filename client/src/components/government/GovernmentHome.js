import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaClock, FaCheckCircle, FaSpinner, FaMapMarkerAlt, FaFilter, FaMap, FaChartBar, FaList } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GovernmentHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalComplaints: 0,
    assignedComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const dashboardResponse = await axios.get('/api/government/dashboard');
      const complaintsResponse = await axios.get('/api/complaints?limit=5');
      
      const dashboardData = dashboardResponse.data;
      setStats(dashboardData.stats || {});
      setRecentComplaints(dashboardData.recentComplaints || complaintsResponse.data.complaints || []);
      setCategoryStats(dashboardData.categoryStats || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set fallback data in case of error
      try {
        const complaintsResponse = await axios.get('/api/complaints?limit=5');
        setRecentComplaints(complaintsResponse.data.complaints || []);
      } catch (fallbackError) {
        console.error('Fallback fetch also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-green-100">Monitor and manage civic complaints across the city</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalComplaints}</p>
            </div>
            <FaExclamationTriangle className="text-blue-500 text-xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Assigned to You</p>
              <p className="text-2xl font-bold text-green-600">{stats.assignedComplaints}</p>
            </div>
            <FaMapMarkerAlt className="text-green-500 text-xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingComplaints}</p>
            </div>
            <FaClock className="text-yellow-500 text-xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-orange-600">{stats.inProgressComplaints}</p>
            </div>
            <FaSpinner className="text-orange-500 text-xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolvedComplaints}</p>
            </div>
            <FaCheckCircle className="text-green-500 text-xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Statistics */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Complaints by Category</h2>
            <p className="text-gray-600">Distribution of issues across different categories</p>
          </div>
          
          <div className="p-6">
            {categoryStats.length === 0 ? (
              <div className="text-center py-8">
                <FaFilter className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500">No category data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categoryStats.map((category) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {category.category.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{category.count} complaints</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(category.count / Math.max(...categoryStats.map(c => c.count))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Complaints</h2>
            <p className="text-gray-600">Latest reported issues</p>
          </div>
          
          <div className="p-6">
            {recentComplaints.length === 0 ? (
              <div className="text-center py-8">
                <FaExclamationTriangle className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500">No complaints yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <div key={complaint.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{complaint.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{complaint.description.substring(0, 80)}...</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="capitalize">{complaint.category.replace('-', ' ')}</span>
                          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(complaint.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                          {complaint.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/government/map')}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
          >
            <FaMap className="text-blue-600 text-xl mb-2" />
            <h3 className="font-medium text-blue-900">View Map</h3>
            <p className="text-sm text-blue-600">See all complaints on the city map</p>
          </button>
          
          <button 
            onClick={() => navigate('/government/analytics')}
            className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
          >
            <FaChartBar className="text-green-600 text-xl mb-2" />
            <h3 className="font-medium text-green-900">Analytics</h3>
            <p className="text-sm text-green-600">View detailed reports and trends</p>
          </button>
          
          <button 
            onClick={() => navigate('/government/complaints')}
            className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
          >
            <FaList className="text-purple-600 text-xl mb-2" />
            <h3 className="font-medium text-purple-900">All Complaints</h3>
            <p className="text-sm text-purple-600">View and manage all complaints</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GovernmentHome;
