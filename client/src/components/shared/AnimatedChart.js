import React, { useState, useEffect, useRef } from 'react';

const AnimatedChart = ({ 
  data = [], 
  type = 'bar', 
  title = '', 
  className = '',
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  animate = true 
}) => {
  const [animatedData, setAnimatedData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && animate) {
      // Animate data values from 0 to actual values
      const maxValue = Math.max(...data.map(item => item.value));
      let progress = 0;
      const duration = 1500; // 1.5 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      const animateStep = () => {
        progress += 1 / steps;
        if (progress <= 1) {
          setAnimatedData(data.map(item => ({
            ...item,
            value: item.value * progress
          })));
          setTimeout(animateStep, stepDuration);
        } else {
          setAnimatedData(data);
        }
      };

      animateStep();
    } else {
      setAnimatedData(data);
    }
  }, [data, isVisible, animate]);

  const maxValue = Math.max(...data.map(item => item.value));

  const renderBarChart = () => (
    <div className="flex items-end justify-between h-48 px-4">
      {animatedData.map((item, index) => {
        const height = (item.value / maxValue) * 100;
        const color = colors[index % colors.length];
        
        return (
          <div key={item.label} className="flex flex-col items-center flex-1 mx-1">
            <div className="relative w-full max-w-12 group">
              {/* Bar */}
              <div
                className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80 relative overflow-hidden"
                style={{
                  height: `${height}%`,
                  backgroundColor: color,
                  minHeight: '4px'
                }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
                
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {item.value}
                </div>
              </div>
            </div>
            
            {/* Label */}
            <span className="text-xs text-gray-600 mt-2 text-center font-medium">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderDonutChart = () => {
    const total = animatedData.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    const radius = 60;
    const strokeWidth = 20;
    const center = 80;

    return (
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="160" height="160" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth={strokeWidth}
            />
            
            {/* Data segments */}
            {animatedData.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage * 3.77} 377`; // 377 is circumference
              const strokeDashoffset = -currentAngle * 3.77;
              const color = colors[index % colors.length];
              
              currentAngle += percentage;
              
              return (
                <circle
                  key={item.label}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 hover:opacity-80"
                  style={{
                    transformOrigin: `${center}px ${center}px`
                  }}
                />
              );
            })}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="ml-6 space-y-2">
          {animatedData.map((item, index) => (
            <div key={item.label} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-sm font-semibold text-gray-900 ml-auto">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = () => {
    const width = 300;
    const height = 150;
    const padding = 20;
    
    if (animatedData.length < 2) return null;
    
    const xStep = (width - 2 * padding) / (animatedData.length - 1);
    const yMax = Math.max(...animatedData.map(item => item.value));
    
    const points = animatedData.map((item, index) => {
      const x = padding + index * xStep;
      const y = height - padding - ((item.value / yMax) * (height - 2 * padding));
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="flex justify-center">
        <svg width={width} height={height} className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#grid)" opacity="0.5"/>
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={colors[0]}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          />
          
          {/* Points */}
          {animatedData.map((item, index) => {
            const x = padding + index * xStep;
            const y = height - padding - ((item.value / yMax) * (height - 2 * padding));
            
            return (
              <g key={item.label}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={colors[0]}
                  className="hover:r-6 transition-all duration-200 cursor-pointer"
                />
                <text
                  x={x}
                  y={height - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div ref={chartRef} className={`bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-shadow duration-300 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          {title}
        </h3>
      )}
      
      <div className="relative">
        {type === 'bar' && renderBarChart()}
        {type === 'donut' && renderDonutChart()}
        {type === 'line' && renderLineChart()}
      </div>
      
      {/* Loading overlay */}
      {!isVisible && animate && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default AnimatedChart;
