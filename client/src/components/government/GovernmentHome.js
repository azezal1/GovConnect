import React, { useState, useEffect } from 'react';
import { 
  FaExclamationTriangle, 
  FaClock, 
  FaCheckCircle, 
  FaSpinner, 
  FaUsers,
  FaMap, 
  FaChartBar, 
  FaList,
  FaChartLine,
  FaBell,
  FaArrowUp,
  FaArrowDown,
  FaSync
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../shared/Card';
import AnimatedButton from '../shared/AnimatedButton';
import AnimatedChart from '../shared/AnimatedChart';
import InteractiveMap from './InteractiveMap';
import AnimatedFilters from './AnimatedFilters';

const GovernmentHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalComplaints: 45,
    assignedComplaints: 12,
    pendingComplaints: 18,
    inProgressComplaints: 15,
    resolvedComplaints: 12
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [categoryStats, setCategoryStats] = useState([
    { category: 'urban-livelihood', count: 15 },
    { category: 'public-health', count: 12 },
    { category: 'engineering', count: 8 },
    { category: 'admin', count: 6 },
    { category: 'revenue', count: 4 }
  ]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    
    try {
      const dashboardResponse = await axios.get('/api/government/dashboard');
      const complaintsResponse = await axios.get('/api/complaints?limit=10');
      
      const dashboardData = dashboardResponse.data;
      setStats(dashboardData.stats || stats);
      setRecentComplaints(dashboardData.recentComplaints || complaintsResponse.data.complaints || []);
      setCategoryStats(dashboardData.categoryStats || categoryStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      if (showRefresh) setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartBar },
    { id: 'map', label: 'Map View', icon: FaMap },
    { id: 'analytics', label: 'Analytics', icon: FaChartLine }
  ];

  const statCards = [
    {
      title: 'Total Complaints',
      value: stats.totalComplaints,
      change: '+12%',
      trend: 'up',
      icon: FaExclamationTriangle,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Assigned to You',
      value: stats.assignedComplaints,
      change: '+5%',
      trend: 'up',
      icon: FaUsers,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Pending Review',
      value: stats.pendingComplaints,
      change: '-8%',
      trend: 'down',
      icon: FaClock,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50'
    },
    {
      title: 'In Progress',
      value: stats.inProgressComplaints,
      change: '+15%',
      trend: 'up',
      icon: FaSpinner,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50'
    },
    {
      title: 'Resolved',
      value: stats.resolvedComplaints,
      change: '+22%',
      trend: 'up',
      icon: FaCheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-soft mb-4">
            <FaSpinner className="text-3xl text-blue-500 animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading Government Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <Card className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white p-8 relative overflow-hidden" hover={false}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                  <FaUsers className="text-2xl" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Government Portal</h1>
                  <p className="text-blue-200 text-lg">Welcome back, {user?.name}</p>
                </div>
              </div>
              <p className="text-slate-300 max-w-2xl">
                Monitor and manage civic complaints across the city. Track progress, analyze trends, and ensure efficient resolution of citizen issues.
              </p>
            </div>
            
            <div className="hidden lg:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-3xl font-bold">{new Date().toLocaleDateString()}</div>
                <div className="text-blue-200">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
              </div>
              <AnimatedButton
                onClick={handleRefresh}
                variant="ghost"
                loading={refreshing}
                icon={FaSync}
                className="text-white border-white/30 hover:bg-white/10"
              >
                Refresh
              </AnimatedButton>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <Card className="p-2" hover={false}>
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-glow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {statCards.map((stat, index) => (
                <Card key={index} className="p-6 relative overflow-hidden hover-lift" hover={true} gradient={true}>
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-r ${stat.bgColor} rounded-full blur-xl opacity-50`} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-r ${stat.color} text-white rounded-xl shadow-glow`}>
                        <stat.icon className="text-xl" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                        <div className={`flex items-center text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.trend === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                          {stat.change}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700">{stat.title}</h3>
                  </div>
                </Card>
              ))}
            </div>

            {/* Filters */}
            <AnimatedFilters onFiltersChange={handleFiltersChange} />

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatedChart
                type="donut"
                title="Complaints by Status"
                data={[
                  { label: 'Pending', value: stats.pendingComplaints },
                  { label: 'In Progress', value: stats.inProgressComplaints },
                  { label: 'Resolved', value: stats.resolvedComplaints }
                ]}
                colors={['#f59e0b', '#ef4444', '#10b981']}
              />
              
              <AnimatedChart
                type="bar"
                title="Category Distribution"
                data={categoryStats.map(cat => ({
                  label: cat.category.replace('-', ' '),
                  value: cat.count
                }))}
                colors={['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']}
              />
            </div>
          </>
        )}

        {activeTab === 'map' && (
          <div className="space-y-6">
            <InteractiveMap 
              complaints={recentComplaints} 
              onComplaintSelect={() => {}}
              filters={filters}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatedChart
              type="line"
              title="Monthly Trends"
              data={[
                { label: 'Jan', value: 32 },
                { label: 'Feb', value: 28 },
                { label: 'Mar', value: 45 },
                { label: 'Apr', value: 38 },
                { label: 'May', value: stats.totalComplaints }
              ]}
              colors={['#3b82f6']}
            />
            
            <Card className="p-6" hover={true} gradient={true}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Resolution Time</span>
                  <span className="font-semibold text-gray-900">3.2 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Citizen Satisfaction</span>
                  <span className="font-semibold text-green-600">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Rate</span>
                  <span className="font-semibold text-blue-600">98%</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card className="p-6" hover={true} gradient={true}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaBell className="mr-3 text-blue-500" />
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AnimatedButton
              onClick={() => navigate('/government/complaints')}
              variant="primary"
              icon={FaList}
              className="h-20 flex-col"
            >
              <span className="text-sm font-semibold">View All</span>
              <span className="text-xs opacity-90">Complaints</span>
            </AnimatedButton>
            
            <AnimatedButton
              onClick={() => navigate('/government/map')}
              variant="secondary"
              icon={FaMap}
              className="h-20 flex-col"
            >
              <span className="text-sm font-semibold">Interactive</span>
              <span className="text-xs opacity-90">Map View</span>
            </AnimatedButton>
            
            <AnimatedButton
              onClick={() => navigate('/government/analytics')}
              variant="outline"
              icon={FaChartBar}
              className="h-20 flex-col"
            >
              <span className="text-sm font-semibold">Detailed</span>
              <span className="text-xs opacity-90">Analytics</span>
            </AnimatedButton>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default GovernmentHome;
