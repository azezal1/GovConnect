import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaChevronDown,
  FaClock,
  FaExclamationTriangle,
  FaSpinner,
  FaCheckCircle,
  FaSortAmountDown,
  FaSortAmountUp
} from 'react-icons/fa';

const EnhancedSearch = ({ onSearch, onFilter, onSort, totalCount = 0 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: '',
    category: '',
    priority: '',
    dateRange: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Status', icon: FaFilter, color: 'gray' },
    { value: 'pending', label: 'Pending', icon: FaClock, color: 'yellow' },
    { value: 'verified', label: 'Verified', icon: FaExclamationTriangle, color: 'blue' },
    { value: 'in-progress', label: 'In Progress', icon: FaSpinner, color: 'orange' },
    { value: 'resolved', label: 'Resolved', icon: FaCheckCircle, color: 'green' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'admin', label: 'Administration' },
    { value: 'it-section', label: 'IT Services' },
    { value: 'urban-livelihood', label: 'Urban Development' },
    { value: 'elections', label: 'Elections' },
    { value: 'finance', label: 'Finance' },
    { value: 'planning', label: 'Urban Planning' },
    { value: 'public-health', label: 'Public Health' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'engineering', label: 'Engineering' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'critical', label: 'Critical' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: FaSortAmountDown },
    { value: 'oldest', label: 'Oldest First', icon: FaSortAmountUp },
    { value: 'status', label: 'By Status', icon: FaFilter },
    { value: 'priority', label: 'By Priority', icon: FaExclamationTriangle }
  ];

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      onSearch?.(searchTerm);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, onSearch]);

  useEffect(() => {
    onFilter?.(activeFilters);
  }, [activeFilters, onFilter]);

  useEffect(() => {
    onSort?.(sortBy);
  }, [sortBy, onSort]);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      status: '',
      category: '',
      priority: '',
      dateRange: ''
    });
    setSearchTerm('');
    setSortBy('newest');
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value && value !== '').length + (searchTerm ? 1 : 0);
  };

  const getColorClasses = (color, isActive = false) => {
    const colors = {
      gray: isActive ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      yellow: isActive ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      blue: isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      orange: isActive ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      green: isActive ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className={`relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 ${
          isSearchFocused ? 'border-blue-500 shadow-glow' : 'border-gray-200 hover:border-gray-300'
        }`}>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaSearch className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search your complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-12 pr-4 py-4 bg-transparent border-0 outline-none text-gray-900 placeholder-gray-500 text-lg"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              isFilterOpen || getActiveFilterCount() > 0
                ? 'bg-blue-500 text-white shadow-glow'
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FaFilter className="w-4 h-4" />
            <span>Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
            <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${
              isFilterOpen ? 'rotate-180' : ''
            }`} />
          </button>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            <span className="font-medium">{totalCount}</span> complaint{totalCount !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expandable Filters */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isFilterOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 space-y-6">
          
          {/* Status Filter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              Status
            </h4>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => {
                const isActive = activeFilters.status === option.value;
                const IconComponent = option.icon;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('status', option.value)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      getColorClasses(option.color, isActive)
                    } ${isActive ? 'shadow-glow' : 'shadow-sm'}`}
                  >
                    <IconComponent className="w-3 h-3" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Category
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {categoryOptions.map((option) => {
                const isActive = activeFilters.category === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('category', option.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      isActive 
                        ? 'bg-green-500 text-white shadow-glow' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
              Priority
            </h4>
            <div className="flex flex-wrap gap-2">
              {priorityOptions.map((option) => {
                const isActive = activeFilters.priority === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('priority', option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      isActive 
                        ? 'bg-purple-500 text-white shadow-glow' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clear Filters */}
          {getActiveFilterCount() > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearch;
