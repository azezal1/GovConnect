import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaTrophy, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    aadhaar: user?.aadhaar || ''
  });
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    totalPoints: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  useEffect(() => {
    fetchProfileData();
    // Update profile data when user changes
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        aadhaar: user.aadhaar || ''
      });
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const [dashboardResponse, complaintsResponse] = await Promise.all([
        axios.get('/api/citizen/dashboard'),
        axios.get('/api/citizen/complaints?limit=5')
      ]);

      // Handle dashboard data structure
      const dashboardData = dashboardResponse.data;
      setStats({
        totalComplaints: dashboardData.stats?.totalComplaints || 0,
        pendingComplaints: dashboardData.stats?.pendingComplaints || 0,
        inProgressComplaints: dashboardData.stats?.inProgressComplaints || 0,
        resolvedComplaints: dashboardData.stats?.resolvedComplaints || 0,
        totalPoints: dashboardData.stats?.totalPoints || 0
      });
      
      // Set recent complaints from dashboard or complaints endpoint
      setRecentComplaints(dashboardData.recentComplaints || complaintsResponse.data.complaints || []);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    reset(profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset(profileData);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.put('/api/citizen/profile', data);
      const updatedUser = response.data.user;
      setProfileData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        mobile: updatedUser.mobile || '',
        aadhaar: updatedUser.aadhaar || ''
      });
      updateProfile(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>;
      case 'verified': return <span className="w-2 h-2 bg-blue-500 rounded-full"></span>;
      case 'in-progress': return <span className="w-2 h-2 bg-orange-500 rounded-full"></span>;
      case 'resolved': return <span className="w-2 h-2 bg-green-500 rounded-full"></span>;
      default: return <span className="w-2 h-2 bg-gray-500 rounded-full"></span>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'verified': return 'text-blue-600';
      case 'in-progress': return 'text-orange-600';
      case 'resolved': return 'text-green-600';
      default: return 'text-gray-600';
    }
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
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <FaUser className="text-3xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-blue-100">Citizen Portal</p>
            <div className="flex items-center space-x-2 mt-2">
              <FaTrophy className="text-yellow-300" />
              <span className="text-xl font-semibold">{stats.totalPoints} Reward Points</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="text-blue-600 hover:text-blue-700 p-2"
                  title="Edit Profile"
                >
                  <FaEdit />
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="text-gray-600 hover:text-gray-700 p-2"
                    title="Cancel"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    {...register('mobile', { 
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Please enter a valid 10-digit mobile number'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.mobile && (
                    <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhaar Number (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('aadhaar', {
                      pattern: {
                        value: /^[0-9]{12}$/,
                        message: 'Please enter a valid 12-digit Aadhaar number'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12-digit Aadhaar number"
                  />
                  {errors.aadhaar && (
                    <p className="mt-1 text-sm text-red-600">{errors.aadhaar.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <FaSave />
                  <span>Save Changes</span>
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaUser className="text-gray-400 w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{profileData.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-gray-400 w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{profileData.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaPhone className="text-gray-400 w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Mobile</p>
                    <p className="font-medium text-gray-900">{profileData.mobile}</p>
                  </div>
                </div>

                {profileData.aadhaar && (
                  <div className="flex items-center space-x-3">
                    <FaIdCard className="text-gray-400 w-5" />
                    <div>
                      <p className="text-sm text-gray-500">Aadhaar</p>
                      <p className="font-medium text-gray-900">{profileData.aadhaar}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Statistics and Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalComplaints}</div>
                <div className="text-sm text-blue-600">Total Complaints</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingComplaints}</div>
                <div className="text-sm text-yellow-600">Pending</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.inProgressComplaints}</div>
                <div className="text-sm text-orange-600">In Progress</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.resolvedComplaints}</div>
                <div className="text-sm text-green-600">Resolved</div>
              </div>
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Complaints</h2>
              <p className="text-gray-600">Your latest reported issues</p>
            </div>
            
            <div className="p-6">
              {recentComplaints.length === 0 ? (
                <div className="text-center py-8">
                  <FaUser className="text-gray-400 text-4xl mx-auto mb-4" />
                  <p className="text-gray-500">No complaints yet. Start by reporting an issue!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentComplaints.map((complaint) => (
                    <div key={complaint.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(complaint.status)}
                        <div>
                          <h3 className="font-medium text-gray-900">{complaint.title}</h3>
                          <p className="text-sm text-gray-600">{complaint.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${getStatusColor(complaint.status)}`}>
                          {complaint.status.replace('-', ' ')}
                        </span>
                        <p className="text-xs text-gray-500">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
