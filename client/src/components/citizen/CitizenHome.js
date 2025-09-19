import React, { useState, useEffect } from 'react';
import { 
  FaExclamationTriangle, 
  FaClock, 
  FaCheckCircle, 
  FaSpinner, 
  FaTrophy, 
  FaPlus,
  FaEye,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaAward,
  FaChartLine,
  FaBell
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../shared/Card';
import Button from '../shared/Button';

const CitizenHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    totalPoints: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardResponse, complaintsResponse] = await Promise.all([
        axios.get('/api/citizen/dashboard'),
        axios.get('/api/citizen/complaints?limit=5')
      ]);

      setStats(dashboardResponse.data.stats || {});
      setRecentComplaints(dashboardResponse.data.recentComplaints || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'verified': return <FaExclamationTriangle className="text-blue-500" />;
      case 'in-progress': return <FaSpinner className="text-orange-500 animate-spin" />;
      case 'resolved': return <FaCheckCircle className="text-green-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'verified': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <FaSpinner className="text-5xl text-blue-500 animate-spin mb-4 mx-auto" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Complaints',
      value: stats.totalComplaints,
      icon: FaExclamationTriangle,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Pending',
      value: stats.pendingComplaints,
      icon: FaClock,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50'
    },
    {
      title: 'In Progress',
      value: stats.inProgressComplaints,
      icon: FaSpinner,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50'
    },
    {
      title: 'Resolved',
      value: stats.resolvedComplaints,
      icon: FaCheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 relative overflow-hidden" hover={false}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-lg" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-blue-100 text-lg">Track your complaints and earn rewards for helping improve your city.</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/citizen/submit')}
                variant="glass"
                icon={<FaPlus />}
                className="animate-pulse-glow"
              >
                Submit New Complaint
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-6 relative overflow-hidden" hover={true} gradient={true}>
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-r ${stat.bgColor} rounded-full blur-xl opacity-50`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${stat.color} text-white rounded-xl shadow-glow`}>
                    <stat.icon className="text-2xl" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
              </div>
            </Card>
          ))}
        </div>

        {/* Reward Points Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 p-6 bg-gradient-to-br from-yellow-50 to-orange-50" hover={true}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl mb-4 shadow-glow">
                <FaTrophy className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.totalPoints}</h3>
              <p className="text-gray-600 mb-4">Reward Points</p>
              <Button variant="outline" size="sm" onClick={() => navigate('/citizen/rewards')}>
                View Rewards
              </Button>
            </div>
          </Card>

          <Card className="lg:col-span-2 p-6" hover={true} gradient={true}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
              <FaBell className="text-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => navigate('/citizen/submit')}
                variant="primary"
                icon={<FaPlus />}
                className="h-20 flex-col"
              >
                <span className="text-sm">Submit</span>
                <span className="text-xs opacity-80">New Complaint</span>
              </Button>
              <Button 
                onClick={() => navigate('/citizen/complaints')}
                variant="secondary"
                icon={<FaEye />}
                className="h-20 flex-col"
              >
                <span className="text-sm">View All</span>
                <span className="text-xs opacity-80">Complaints</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Complaints */}
        <Card className="p-6" hover={true} gradient={true}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Complaints</h2>
              <p className="text-gray-600">Your latest reported issues</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/citizen/complaints')}
              icon={<FaEye />}
            >
              View All
            </Button>
          </div>
          
          {recentComplaints.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
                <FaExclamationTriangle className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No complaints yet</h3>
              <p className="text-gray-600 mb-6">Start by reporting an issue in your community!</p>
              <Button 
                onClick={() => navigate('/citizen/submit')}
                icon={<FaPlus />}
              >
                Submit Your First Complaint
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <Card key={complaint.id} className="p-4 hover:shadow-medium transition-all duration-300" hover={true}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(complaint.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{complaint.title}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600">{complaint.category}</span>
                          {complaint.location && (
                            <div className="flex items-center text-sm text-gray-500">
                              <FaMapMarkerAlt className="mr-1" />
                              {complaint.location}
                            </div>
                          )}
                          {complaint.createdAt && (
                            <div className="flex items-center text-sm text-gray-500">
                              <FaCalendarAlt className="mr-1" />
                              {formatDate(complaint.createdAt)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                        {complaint.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/citizen/complaints/${complaint.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CitizenHome;
