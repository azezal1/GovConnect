import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  icon,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className={`block text-sm font-medium transition-colors duration-200 ${
          error ? 'text-red-600' : isFocused ? 'text-blue-600' : 'text-gray-700'
        }`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={`text-sm ${error ? 'text-red-400' : isFocused ? 'text-blue-500' : 'text-gray-400'}`}>
              {icon}
            </span>
          </div>
        )}
        
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`
            block w-full px-4 py-3 text-gray-900 placeholder-gray-500 bg-white border rounded-lg
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0
            ${icon ? 'pl-10' : 'pl-4'}
            ${type === 'password' ? 'pr-10' : 'pr-4'}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
              : isFocused 
                ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-500/20' 
                : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled 
              ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
              : 'hover:shadow-soft'
            }
          `}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            tabIndex={-1}
          >
            <span className={`text-sm ${isFocused ? 'text-blue-500' : 'text-gray-400'} hover:text-gray-600`}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </button>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center animate-slide-down">
          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
