import React, { useState } from 'react';

const TextArea = ({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  rows = 4,
  maxLength,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    if (onChange) onChange(e);
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
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`
            block w-full px-4 py-3 text-gray-900 placeholder-gray-500 bg-white border rounded-lg
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 resize-none
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
        
        {maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {charCount}/{maxLength}
          </div>
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

export default TextArea;
