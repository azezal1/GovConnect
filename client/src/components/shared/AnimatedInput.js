import React, { useState, useRef, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AnimatedInput = React.forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  icon: Icon,
  className = '',
  required = false,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setHasValue(value && value.length > 0);
  }, [value]);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0);
    onChange?.(e);
  };

  const isActive = isFocused || hasValue;
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`relative group ${className}`}>
      {/* Animated background */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isFocused ? 'opacity-100' : ''}`} />
      
      {/* Input container */}
      <div className={`relative bg-white/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 ${
        error 
          ? 'border-red-300 shadow-red-100' 
          : isFocused 
            ? 'border-blue-500 shadow-blue-100' 
            : 'border-gray-200 hover:border-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        
        {/* Icon */}
        {Icon && (
          <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
            isFocused ? 'text-blue-500' : 'text-gray-400'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Input field */}
        <input
          ref={ref || inputRef}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`w-full px-4 py-4 bg-transparent border-0 outline-none text-gray-900 placeholder-transparent transition-all duration-300 ${
            Icon ? 'pl-12' : ''
          } ${type === 'password' ? 'pr-12' : ''}`}
          placeholder={placeholder}
          {...props}
        />

        {/* Floating label */}
        <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
          Icon ? 'left-12' : 'left-4'
        } ${
          isActive
            ? 'top-2 text-xs font-medium text-blue-600 transform scale-90'
            : 'top-1/2 transform -translate-y-1/2 text-gray-500'
        }`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Password toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
          </button>
        )}

        {/* Focus indicator */}
        <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
          isFocused ? 'w-full' : 'w-0'
        }`} />
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-600 animate-slide-up flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Success indicator */}
      {!error && hasValue && !isFocused && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
});

AnimatedInput.displayName = 'AnimatedInput';

export default AnimatedInput;
