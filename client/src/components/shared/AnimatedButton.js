import React, { useState } from 'react';

const AnimatedButton = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = `
    relative overflow-hidden font-semibold rounded-xl transition-all duration-300 
    transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-4 focus:ring-opacity-50
    group
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 
      hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-blue-300
      before:absolute before:inset-0 before:bg-gradient-to-r 
      before:from-white/20 before:via-white/10 before:to-transparent 
      before:translate-x-[-100%] hover:before:translate-x-[100%] 
      before:transition-transform before:duration-700
    `,
    secondary: `
      bg-white/80 backdrop-blur-sm border-2 border-gray-200 
      hover:border-gray-300 hover:bg-white/90
      text-gray-700 hover:text-gray-900
      shadow-soft hover:shadow-medium
      focus:ring-gray-300
    `,
    outline: `
      bg-transparent border-2 border-blue-500 
      hover:bg-blue-500 hover:border-blue-600
      text-blue-500 hover:text-white
      focus:ring-blue-300
      transition-colors duration-300
    `,
    ghost: `
      bg-transparent hover:bg-gray-100/80
      text-gray-600 hover:text-gray-900
      focus:ring-gray-300
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-pink-500 
      hover:from-red-600 hover:to-pink-600
      text-white shadow-lg hover:shadow-xl
      focus:ring-red-300
    `,
    success: `
      bg-gradient-to-r from-green-500 to-emerald-500 
      hover:from-green-600 hover:to-emerald-600
      text-white shadow-lg hover:shadow-xl
      focus:ring-green-300
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${isPressed ? 'scale-95' : 'hover:scale-105'}
        ${loading ? 'cursor-wait' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
      
      {/* Ripple effect container */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className={`absolute inset-0 bg-white/20 rounded-full scale-0 group-active:scale-100 transition-transform duration-300 ${isPressed ? 'animate-ping' : ''}`} />
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-center space-x-2">
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && (
              <Icon className={`transition-transform duration-300 group-hover:scale-110 ${
                size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
              }`} />
            )}
            <span className="transition-all duration-300 group-hover:tracking-wide">
              {children}
            </span>
            {Icon && iconPosition === 'right' && (
              <Icon className={`transition-transform duration-300 group-hover:scale-110 ${
                size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
              }`} />
            )}
          </>
        )}
      </div>

      {/* Glow effect for primary variant */}
      {variant === 'primary' && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
      )}
    </button>
  );
};

export default AnimatedButton;
