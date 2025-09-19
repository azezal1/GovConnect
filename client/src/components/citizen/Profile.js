import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaIdCard, 
  FaTrophy, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaCamera,
  FaShield,
  FaStar,
  FaAward,
  FaChartLine,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaSpinner,
  FaEye,
  FaHeart,
  FaFire,
  FaCrown,
  FaGem
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
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
  const [achievements, setAchievements] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      aadhaar: ''
    }
  });

  useEffect(() => {
    setIsVisible(true);
    fetchProfileData();
    
    // Generate floating elements for background animation
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 30,
      delay: Math.random() * 5,
      duration: Math.random() * 15 + 20,
    }));
    setFloatingElements(elements);
    
    // Update profile data when user changes
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        aadhaar: user.aadhaar || ''
      });
      
      // Reset form with user data
      reset({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        aadhaar: user.aadhaar || ''
      });
    }
  }, [user, reset]);

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

  // Mock achievements data
  const mockAchievements = [
    { id: 1, title: 'First Complaint', description: 'Submitted your first complaint', icon: FaAward, color: 'from-blue-500 to-cyan-500', unlocked: true },
    { id: 2, title: 'Problem Solver', description: 'Had 5 complaints resolved', icon: FaCheckCircle, color: 'from-green-500 to-emerald-500', unlocked: stats.resolvedComplaints >= 5 },
    { id: 3, title: 'Community Hero', description: 'Earned 100 reward points', icon: FaTrophy, color: 'from-yellow-500 to-orange-500', unlocked: stats.totalPoints >= 100 },
    { id: 4, title: 'Super Citizen', description: 'Submitted 10 complaints', icon: FaCrown, color: 'from-purple-500 to-pink-500', unlocked: stats.totalComplaints >= 10 }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaUser },
    { id: 'profile', label: 'Profile Settings', icon: FaEdit },
    { id: 'achievements', label: 'Achievements', icon: FaTrophy }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 flex items-center space-x-4">
          <FaSpinner className="text-3xl text-blue-600 animate-spin" />
          <span className="text-xl text-gray-700">Loading Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 animate-float"
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
          
          {/* Modern Profile Header */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden">
            {/* Background Gradient Orb */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile Avatar */}
                <div className="relative group">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
                    <FaUser className="text-5xl text-white" />
                  </div>
                  <button className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <FaCamera className="text-gray-600" />
                  </button>
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {user?.name || 'Citizen'}
                  </h1>
                  <p className="text-gray-600 text-lg mb-4">Active Community Member</p>
                  
                  {/* Stats Row */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-6">
                    <div className="text-center">
                      <div className="flex items-center space-x-2">
                        <FaTrophy className="text-yellow-500" />
                        <span className="text-2xl font-bold text-gray-800">{stats.totalPoints}</span>
                      </div>
                      <p className="text-sm text-gray-600">Reward Points</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center space-x-2">
                        <FaAward className="text-blue-500" />
                        <span className="text-2xl font-bold text-gray-800">{stats.totalComplaints}</span>
                      </div>
                      <p className="text-sm text-gray-600">Total Reports</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center space-x-2">
                        <FaCheckCircle className="text-green-500" />
                        <span className="text-2xl font-bold text-gray-800">{stats.resolvedComplaints}</span>
                      </div>
                      <p className="text-sm text-gray-600">Resolved</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-2">
            <div className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-medium transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                        : 'text-gray-600 hover:bg-white/20 hover:text-gray-800'
                      }
                    `}
                  >
                    <Icon className="text-lg" />
                    <span className="hidden md:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in-up">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Complaints', value: stats.totalComplaints, icon: FaChartLine, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Pending', value: stats.pendingComplaints, icon: FaClock, color: 'from-yellow-500 to-orange-500' },
                    { label: 'In Progress', value: stats.inProgressComplaints, icon: FaSpinner, color: 'from-orange-500 to-red-500' },
                    { label: 'Resolved', value: stats.resolvedComplaints, icon: FaCheckCircle, color: 'from-green-500 to-emerald-500' }
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

                {/* Recent Complaints */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentComplaints.length === 0 ? (
                      <div className="text-center py-12 bg-white/10 rounded-2xl border border-white/20">
                        <FaExclamationTriangle className="text-gray-400 text-4xl mx-auto mb-4" />
                        <p className="text-gray-600">No recent complaints. Start by reporting an issue!</p>
                      </div>
                    ) : (
                      recentComplaints.map((complaint, index) => (
                        <div 
                          key={complaint.id}
                          className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {getStatusIcon(complaint.status)}
                              <div>
                                <h4 className="font-semibold text-gray-800">{complaint.title}</h4>
                                <p className="text-gray-600 text-sm">{complaint.category}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                              {complaint.status.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">Profile Settings</h3>
                  {!isEditing && (
                    <button
                      onClick={handleEdit}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <FaEdit />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {[
                      { name: 'name', label: 'Full Name', type: 'text', icon: FaUser, required: true },
                      { name: 'email', label: 'Email Address', type: 'email', icon: FaEnvelope, required: true },
                      { name: 'mobile', label: 'Mobile Number', type: 'tel', icon: FaPhone, required: true },
                      { name: 'aadhaar', label: 'Aadhaar Number', type: 'text', icon: FaIdCard, required: false }
                    ].map((field, index) => {
                      const Icon = field.icon;
                      return (
                        <div key={field.name} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                              <Icon className="text-gray-400" />
                            </div>
                            <input
                              type={field.type}
                              {...register(field.name, { 
                                required: field.required ? `${field.label} is required` : false,
                                ...(field.name === 'email' && {
                                  pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                  }
                                }),
                                ...(field.name === 'mobile' && {
                                  pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: 'Please enter a valid 10-digit mobile number'
                                  }
                                }),
                                ...(field.name === 'aadhaar' && {
                                  pattern: {
                                    value: /^[0-9]{12}$/,
                                    message: 'Please enter a valid 12-digit Aadhaar number'
                                  }
                                })
                              })}
                              className={`
                                w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-md border-2 rounded-2xl
                                text-gray-800 placeholder-gray-500 focus:outline-none transition-all duration-300
                                ${errors[field.name] ? 'border-red-400' : 'border-white/20 focus:border-blue-400'}
                              `}
                              placeholder={field.label}
                            />
                          </div>
                          {errors[field.name] && (
                            <p className="mt-2 text-red-500 text-sm flex items-center">
                              <FaExclamationTriangle className="mr-2" />
                              {errors[field.name].message}
                            </p>
                          )}
                        </div>
                      );
                    })}

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <FaSave />
                        <span>Save Changes</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <FaTimes />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Full Name', value: profileData.name, icon: FaUser },
                      { label: 'Email Address', value: profileData.email, icon: FaEnvelope },
                      { label: 'Mobile Number', value: profileData.mobile, icon: FaPhone },
                      { label: 'Aadhaar Number', value: profileData.aadhaar || 'Not provided', icon: FaIdCard }
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div 
                          key={item.label}
                          className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-fade-in-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                              <Icon className="text-white" />
                            </div>
                            <div>
                              <p className="text-gray-600 text-sm">{item.label}</p>
                              <p className="font-semibold text-gray-800">{item.value}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-8 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-800">Achievements & Badges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockAchievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <div 
                        key={achievement.id}
                        className={`
                          relative p-6 rounded-2xl border-2 transition-all duration-300 animate-fade-in-up
                          ${achievement.unlocked 
                            ? `bg-gradient-to-br ${achievement.color} bg-opacity-20 border-white/40 shadow-lg` 
                            : 'bg-white/10 border-white/20 opacity-60'
                          }
                        `}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`
                            w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
                            ${achievement.unlocked 
                              ? `bg-gradient-to-br ${achievement.color} text-white shadow-lg` 
                              : 'bg-white/20 text-gray-400'
                            }
                          `}>
                            <Icon className="text-2xl" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-bold text-lg ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                              {achievement.title}
                            </h4>
                            <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                              {achievement.description}
                            </p>
                          </div>
                          {achievement.unlocked && (
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <FaCheckCircle className="text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
