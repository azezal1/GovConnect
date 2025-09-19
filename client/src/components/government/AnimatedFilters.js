import React, { useState, useEffect } from 'react';
import { 
  FaFilter, 
  FaTimes, 
  FaCheck, 
  FaClock, 
  FaSpinner, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaChevronDown
} from 'react-icons/fa';

const AnimatedFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [animatingFilters, setAnimatingFilters] = useState(new Set());

  const statusOptions = [
    { value: '', label: 'All Status', icon: FaFilter, color: 'gray' },
    { value: 'pending', label: 'Pending', icon: FaClock, color: 'yellow' },
    { value: 'verified', label: 'Verified', icon: FaExclamationTriangle, color: 'blue' },
    { value: 'in_progress', label: 'In Progress', icon: FaSpinner, color: 'orange' },
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
    { value: '', label: 'All Priorities', color: 'gray' },
    { value: 'low', label: 'Low Priority', color: 'green' },
    { value: 'medium', label: 'Medium Priority', color: 'yellow' },
    { value: 'high', label: 'High Priority', color: 'orange' },
    { value: 'critical', label: 'Critical', color: 'red' }
  ];

  useEffect(() => {
    onFiltersChange?.(activeFilters);
  }, [activeFilters, onFiltersChange]);

  const handleFilterChange = (filterType, value) => {
    // Add animation effect
    setAnimatingFilters(prev => new Set([...prev, filterType]));
    setTimeout(() => {
      setAnimatingFilters(prev => {
        const newSet = new Set(prev);
        newSet.delete(filterType);
        return newSet;
      });
    }, 300);

    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setAnimatingFilters(new Set(['status', 'category', 'priority']));
    setTimeout(() => setAnimatingFilters(new Set()), 300);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value && value !== '').length;
  };

  const getColorClasses = (color, isActive = false) => {
    const colors = {
      gray: isActive ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      yellow: isActive ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      blue: isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      orange: isActive ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      green: isActive ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200',
      red: isActive ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden">
      {/* Filter Header */}
      <div 
        className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b cursor-pointer hover:from-blue-100 hover:to-purple-100 transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <FaFilter className="text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <p className="text-sm text-gray-600">
                {getActiveFilterCount() > 0 
                  ? `${getActiveFilterCount()} filter${getActiveFilterCount() > 1 ? 's' : ''} active`
                  : 'Click to filter complaints'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getActiveFilterCount() > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearAllFilters();
                }}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors duration-200"
              >
                Clear All
              </button>
            )}
            <FaChevronDown 
              className={`text-gray-500 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`transition-all duration-500 ease-in-out ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="p-6 space-y-6">
          
          {/* Status Filter */}
          <div className={`transition-all duration-300 ${
            animatingFilters.has('status') ? 'scale-105' : 'scale-100'
          }`}>
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
                    {isActive && <FaCheck className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div className={`transition-all duration-300 ${
            animatingFilters.has('category') ? 'scale-105' : 'scale-100'
          }`}>
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
                    {isActive && <FaCheck className="w-3 h-3 ml-1 inline" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div className={`transition-all duration-300 ${
            animatingFilters.has('priority') ? 'scale-105' : 'scale-100'
          }`}>
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
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      getColorClasses(option.color, isActive)
                    } ${isActive ? 'shadow-glow' : 'shadow-sm'}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      option.color === 'gray' ? 'bg-gray-400' :
                      option.color === 'green' ? 'bg-green-400' :
                      option.color === 'yellow' ? 'bg-yellow-400' :
                      option.color === 'orange' ? 'bg-orange-400' :
                      'bg-red-400'
                    }`} />
                    <span>{option.label}</span>
                    {isActive && <FaCheck className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filters Summary */}
          {getActiveFilterCount() > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">Active Filters:</span>
                  <div className="flex items-center space-x-1">
                    {Object.entries(activeFilters).map(([key, value]) => {
                      if (!value) return null;
                      
                      const getLabel = () => {
                        if (key === 'status') return statusOptions.find(o => o.value === value)?.label;
                        if (key === 'category') return categoryOptions.find(o => o.value === value)?.label;
                        if (key === 'priority') return priorityOptions.find(o => o.value === value)?.label;
                        return value;
                      };

                      return (
                        <span
                          key={key}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {getLabel()}
                          <button
                            onClick={() => handleFilterChange(key, '')}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <FaTimes className="w-2 h-2" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimatedFilters;
