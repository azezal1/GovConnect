import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  glass = false, 
  gradient = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'rounded-xl transition-all duration-300';
  
  const glassClasses = glass 
    ? 'bg-white/10 backdrop-blur-md border border-white/20 shadow-glass' 
    : 'bg-white shadow-soft border border-gray-100';
    
  const gradientClasses = gradient 
    ? 'bg-gradient-to-br from-white via-white to-blue-50' 
    : '';
    
  const hoverClasses = hover 
    ? 'hover:shadow-medium hover:scale-105 hover:-translate-y-1' 
    : '';
    
  const clickableClasses = onClick 
    ? 'cursor-pointer' 
    : '';

  const combinedClasses = `${baseClasses} ${glassClasses} ${gradientClasses} ${hoverClasses} ${clickableClasses} ${className}`;

  return (
    <div 
      className={combinedClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
