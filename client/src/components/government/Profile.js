import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaIdCard, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaChartBar, 
  FaMapMarkerAlt,
  FaShieldAlt,
  FaAward,
  FaTrophy,
  FaCrown,
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaExclamationTriangle,
  FaCamera,
  FaBell,
  FaCog,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaEquals
} from 'react-icons/fa';
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
    department: user?.department || ''
  });
  const [stats, setStats] = useState({
    totalAssigned: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    resolutionRate: 0
  });
  const [recentWork, setRecentWork] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modern UI states
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [focusedField, setFocusedField] = useState(null);
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
      department: ''
    }
  });

  useEffect(() => {
    setIsVisible(true);
    fetchProfileData();
    
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
    
    // Initialize achievements
    const mockAchievements = [
      { id: 1, title: 'Quick Resolver', description: 'Resolved 10 complaints in a day', icon: FaAward, color: 'from-blue-500 to-cyan-500', unlocked: true },
      { id: 2, title: 'Department Star', description: 'Top performer this month', icon: FaTrophy, color: 'from-yellow-500 to-orange-500', unlocked: true },
      { id: 3, title: 'Efficiency Expert', description: '95%+ resolution rate', icon: FaCrown, color: 'from-purple-500 to-pink-500', unlocked: false },
      { id: 4, title: 'Community Hero', description: 'Resolved 100+ complaints', icon: FaShieldAlt, color: 'from-green-500 to-emerald-500', unlocked: false }
    ];
    setAchievements(mockAchievements);
    
    // Update profile data when user changes
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        department: user.department || ''
      });
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const [dashboardResponse, assignedResponse] = await Promise.all([
        axios.get('/api/government/dashboard'),
        axios.get('/api/government/assigned-complaints?limit=5')
      ]);

      // Handle dashboard data structure
      const dashboardData = dashboardResponse.data;
      const assignedComplaints = dashboardData.stats?.assignedComplaints || 0;
      const resolvedComplaints = dashboardData.stats?.resolvedComplaints || 0;
      
      setStats({
        totalAssigned: assignedComplaints,
        pending: dashboardData.stats?.pendingComplaints || 0,
        inProgress: dashboardData.stats?.inProgressComplaints || 0,
        resolved: resolvedComplaints,
        resolutionRate: assignedComplaints > 0 ? 
          ((resolvedComplaints / assignedComplaints) * 100).toFixed(1) : 0
      });
      
      setRecentWork(assignedResponse.data.complaints || []);
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
      const response = await axios.put('/api/government/profile', data);
      const updatedUser = response.data.user;
      setProfileData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        mobile: updatedUser.mobile || '',
        department: updatedUser.department || ''
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaUser },
    { id: 'profile', label: 'Profile Settings', icon: FaEdit },
    { id: 'achievements', label: 'Achievements', icon: FaTrophy }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 flex items-center space-x-4">
          <FaSpinner className="text-3xl text-emerald-600 animate-spin" />
          <span className="text-xl text-gray-700">Loading Profile...</span>
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
          
          {/* Modern Profile Header */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden">
            {/* Background Gradient Orb */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile Avatar */}
                <div className="relative group">
                  <div className="w-32 h-32 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl">
                    <FaShieldAlt className="text-5xl text-white" />
                  </div>
                  <button className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <FaCamera className="text-gray-600" />
                  </button>
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                    {user?.name || 'Government Official'}
                  </h1>
                  <p className="text-gray-600 text-lg mb-4">Department Administrator</p>
                  
                  {/* Stats Row */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-6">
                    <div className="text-center">
                      <div className="flex items-center space-x-2">
                        <FaTrophy className="text-yellow-500" />
                        <span className="text-2xl font-bold text-gray-800">{stats.resolutionRate}%</span>
                      </div>
                      <p className="text-sm text-gray-600">Resolution Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center space-x-2">
                        <FaAward className="text-emerald-500" />
                        <span className="text-2xl font-bold text-gray-800">{stats.totalAssigned}</span>
                      </div>
                      <p className="text-sm text-gray-600">Total Assigned</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center space-x-2">
                        <FaCheckCircle className="text-green-500" />
                        <span className="text-2xl font-bold text-gray-800">{stats.resolved}</span>
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
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
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
                    { label: 'Total Assigned', value: stats.totalAssigned, icon: FaChartBar, color: 'from-blue-500 to-cyan-500', trend: 'up' },
                    { label: 'Pending', value: stats.pending, icon: FaClock, color: 'from-yellow-500 to-orange-500', trend: 'down' },
                    { label: 'In Progress', value: stats.inProgress, icon: FaSpinner, color: 'from-orange-500 to-red-500', trend: 'equal' },
                    { label: 'Resolved', value: stats.resolved, icon: FaCheckCircle, color: 'from-green-500 to-emerald-500', trend: 'up' }
                  ].map((stat, index) => {
                    const Icon = stat.icon;
                    const TrendIcon = stat.trend === 'up' ? FaArrowUp : stat.trend === 'down' ? FaArrowDown : FaEquals;
                    return (
                      <div 
                        key={stat.label}
                        className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300 animate-fade-in-up group"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="text-white text-xl" />
                          </div>
                          <TrendIcon className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`} />
                        </div>
                        <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                        <div className="text-gray-600 text-sm">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Resolution Rate Progress */}
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Overall Resolution Rate</h3>
                    <span className="text-2xl font-bold text-emerald-600">{stats.resolutionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200/50 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-4 rounded-full transition-all duration-1000 shadow-lg"
                      style={{ width: `${stats.resolutionRate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Recent Work */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentWork.length === 0 ? (
                      <div className="text-center py-12 bg-white/10 rounded-2xl border border-white/20">
                        <FaMapMarkerAlt className="text-gray-400 text-4xl mx-auto mb-4" />
                        <p className="text-gray-600">No recent assignments</p>
                      </div>
                    ) : (
                      recentWork.map((complaint, index) => (
                        <div 
                          key={complaint.id}
                          className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {getStatusIcon(complaint.status)}
                              <div>
                                <h4 className="font-medium text-gray-800">{complaint.title}</h4>
                                <p className="text-sm text-gray-600">{complaint.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-sm font-medium ${getStatusColor(complaint.status)}`}>
                                {complaint.status.replace('_', ' ')}
                              </span>
                              <p className="text-xs text-gray-500">
                                {new Date(complaint.createdAt).toLocaleDateString()}
                              </p>
                            </div>
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
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h3>
                
                {isEditing ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {[
                      { name: 'name', label: 'Full Name', type: 'text', icon: FaUser, required: true },
                      { name: 'email', label: 'Email Address', type: 'email', icon: FaEnvelope, required: true },
                      { name: 'mobile', label: 'Mobile Number', type: 'tel', icon: FaPhone, required: true },
                      { name: 'department', label: 'Department', type: 'text', icon: FaIdCard, required: false }
                    ].map((field) => {
                      const Icon = field.icon;
                      const isFocused = focusedField === field.name;
                      return (
                        <div key={field.name} className="relative">
                          <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-105' : ''}`}>
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                              <Icon className={`transition-colors duration-300 ${isFocused ? 'text-emerald-500' : 'text-gray-400'}`} />
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
                                })
                              })}
                              onFocus={() => setFocusedField(field.name)}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-md border-2 rounded-2xl text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none ${
                                isFocused ? 'border-emerald-400 shadow-lg shadow-emerald-500/20' : 'border-white/20'
                              } ${errors[field.name] ? 'border-red-400' : ''}`}
                              placeholder={field.label}
                            />
                            <label className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                              isFocused ? '-top-2 text-xs text-emerald-600 bg-white/80 px-2 rounded' : 'top-1/2 transform -translate-y-1/2 text-gray-500'
                            }`}>
                              {field.label}
                            </label>
                          </div>
                          {errors[field.name] && (
                            <p className="mt-2 text-sm text-red-600 animate-fade-in">{errors[field.name].message}</p>
                          )}
                        </div>
                      );
                    })}
                    
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-6 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 font-medium"
                      >
                        <FaSave />
                        <span>Save Changes</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-4 bg-white/20 backdrop-blur-md text-gray-700 rounded-2xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-2"
                      >
                        <FaTimes />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {[
                      { label: 'Full Name', value: profileData.name, icon: FaUser },
                      { label: 'Email Address', value: profileData.email, icon: FaEnvelope },
                      { label: 'Mobile Number', value: profileData.mobile, icon: FaPhone },
                      { label: 'Department', value: profileData.department, icon: FaIdCard }
                    ].filter(item => item.value).map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div 
                          key={item.label}
                          className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                              <Icon className="text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">{item.label}</p>
                              <p className="font-medium text-gray-800 text-lg">{item.value}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    <button
                      onClick={handleEdit}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-6 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 font-medium"
                    >
                      <FaEdit />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-8 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Achievements & Badges</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <div 
                        key={achievement.id}
                        className={`relative bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 transition-all duration-300 animate-fade-in-up ${
                          achievement.unlocked ? 'hover:shadow-lg' : 'opacity-60'
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${achievement.color} flex items-center justify-center shadow-lg ${
                            achievement.unlocked ? '' : 'grayscale'
                          }`}>
                            <Icon className="text-white text-2xl" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-lg">{achievement.title}</h4>
                            <p className="text-gray-600 text-sm">{achievement.description}</p>
                            <div className="mt-2">
                              {achievement.unlocked ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <FaCheckCircle className="mr-1" />
                                  Unlocked
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  <FaClock className="mr-1" />
                                  Locked
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {achievement.unlocked && (
                          <div className="absolute top-2 right-2">
                            <FaCheckCircle className="text-green-500 text-xl" />
                          </div>
                        )}
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
