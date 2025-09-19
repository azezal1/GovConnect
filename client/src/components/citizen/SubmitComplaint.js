import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  FaCamera, 
  FaMapMarkerAlt, 
  FaUpload, 
  FaSpinner, 
  FaTimes, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaLocationArrow,
  FaImage,
  FaFileAlt,
  FaPaperPlane,
  FaEye,
  FaTrash,
  FaGlobe,
  FaFlag,
  FaClock,
  FaUser,
  FaEdit,
  FaStar
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const fileInputRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: 'medium'
    }
  });

  const watchedFields = watch();
  const totalSteps = 3;

  useEffect(() => {
    setIsVisible(true);
    // Generate floating elements for background animation
    const elements = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 20,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15,
    }));
    setFloatingElements(elements);
  }, []);

  const categories = [
    { 
      value: 'admin', 
      label: 'Administration', 
      icon: FaUser,
      color: 'from-blue-500 to-cyan-500',
      description: 'General administrative issues'
    },
    { 
      value: 'it-section', 
      label: 'IT & Technology', 
      icon: FaGlobe,
      color: 'from-purple-500 to-pink-500',
      description: 'Technical and IT related problems'
    },
    { 
      value: 'urban-livelihood', 
      label: 'Urban Development', 
      icon: FaMapMarkerAlt,
      color: 'from-green-500 to-emerald-500',
      description: 'Urban planning and development'
    },
    { 
      value: 'elections', 
      label: 'Elections', 
      icon: FaFlag,
      color: 'from-orange-500 to-red-500',
      description: 'Electoral processes and voting'
    },
    { 
      value: 'finance', 
      label: 'Finance', 
      icon: FaStar,
      color: 'from-yellow-500 to-orange-500',
      description: 'Financial and budget matters'
    },
    { 
      value: 'planning', 
      label: 'Planning', 
      icon: FaEdit,
      color: 'from-indigo-500 to-purple-500',
      description: 'Strategic planning and policies'
    },
    { 
      value: 'public-health', 
      label: 'Public Health', 
      icon: FaCheckCircle,
      color: 'from-teal-500 to-green-500',
      description: 'Health and sanitation issues'
    },
    { 
      value: 'revenue', 
      label: 'Revenue', 
      icon: FaClock,
      color: 'from-pink-500 to-rose-500',
      description: 'Tax and revenue collection'
    },
    { 
      value: 'engineering', 
      label: 'Engineering', 
      icon: FaFileAlt,
      color: 'from-slate-500 to-gray-500',
      description: 'Infrastructure and engineering'
    }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600', bg: 'bg-green-100' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { value: 'high', label: 'High Priority', color: 'text-orange-600', bg: 'bg-orange-100' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600', bg: 'bg-red-100' }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB. Your image is ' + (file.size / (1024 * 1024)).toFixed(2) + 'MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Format location to match server expectations
          setLocation({
            latitude: latitude,
            longitude: longitude,
            address: 'Current location' // Adding a default address
          });
          toast.success('Location captured successfully!');
        },
        (error) => {
          toast.error('Unable to get location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const onSubmit = async (data) => {
    if (!imageFile) {
      toast.error('Please upload an image');
      return;
    }

    if (!location) {
      toast.error('Please capture or enter location');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('priority', data.priority);
      formData.append('location', JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address || 'Address not provided'
      }));
      formData.append('image', imageFile);
      formData.append('isAnonymous', data.isAnonymous || false);

      const response = await axios.post('/api/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Complaint submitted successfully!');
      reset();
      setImageFile(null);
      setImagePreview(null);
      setLocation(null);
    } catch (error) {
        console.error('Error submitting complaint:', error);
        
        // Improved error handling
        if (error.response) {
          // Server responded with an error
          if (error.response.status === 400) {
            // Handle validation errors
            if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
              // Display each validation error
              error.response.data.errors.forEach(err => {
                toast.error(err.msg);
              });
            } else {
              // Fallback for other 400 errors
              toast.error(error.response.data.error || 'Please check your form data and try again.');
            }
          } else {
            // Handle other status codes
            toast.error(`Server error: ${error.response.data.message || error.response.data.error || error.response.statusText}`);
          }
        } else if (error.request) {
          // No response received
          toast.error('No response from server. Please check your internet connection and try again.');
        } else {
          // Request setup error
          toast.error(`Error: ${error.message}`);
        }
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = {
      1: ['title', 'category'],
      2: ['description', 'priority']
    };
    
    const isValid = await trigger(fieldsToValidate[currentStep]);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 animate-fade-in-up">
            {/* Title Input */}
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className={`
                    peer w-full px-6 py-4 bg-white/10 backdrop-blur-md border-2 rounded-2xl
                    text-gray-800 placeholder-transparent focus:outline-none transition-all duration-300
                    ${errors.title ? 'border-red-400' : 'border-white/20 focus:border-blue-400'}
                  `}
                  placeholder="Complaint Title"
                />
                <label className="absolute left-6 -top-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-sm font-medium px-2 peer-placeholder-shown:text-gray-700 peer-placeholder-shown:text-lg peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-blue-400 peer-focus:to-purple-400 peer-focus:bg-clip-text peer-focus:text-transparent transition-all duration-300">
                  Complaint Title *
                </label>
              </div>
              {errors.title && (
                <p className="mt-2 text-red-400 text-sm flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <h3 className="text-gray-800 text-lg font-medium mb-4">Select Category *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  const isSelected = watchedFields.category === category.value;
                  return (
                    <label
                      key={category.value}
                      className={`
                        relative group cursor-pointer animate-fade-in-up
                        ${isSelected ? 'scale-105' : 'hover:scale-105'}
                        transition-all duration-300
                      `}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <input
                        type="radio"
                        {...register('category', { required: 'Category is required' })}
                        value={category.value}
                        className="sr-only"
                      />
                      <div className={`
                        relative p-6 rounded-2xl backdrop-blur-md border-2 transition-all duration-300
                        ${isSelected 
                          ? `bg-gradient-to-br ${category.color} bg-opacity-20 border-white/40 shadow-lg shadow-blue-500/20` 
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                        }
                      `}>
                        <div className="text-center space-y-3">
                          <div className={`
                            w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-all duration-300
                            ${isSelected 
                              ? `bg-gradient-to-br ${category.color} text-white shadow-lg` 
                              : 'bg-white/10 text-white/70 group-hover:bg-white/20'
                            }
                          `}>
                            <Icon className="text-xl" />
                          </div>
                          <div>
                            <h4 className={`font-medium transition-colors duration-200 ${
                              isSelected ? 'text-white' : 'text-gray-800 group-hover:text-gray-900'
                            }`}>
                              {category.label}
                            </h4>
                            <p className={`text-sm transition-colors duration-200 ${
                              isSelected ? 'text-white/80' : 'text-gray-600 group-hover:text-gray-700'
                            }`}>
                              {category.description}
                            </p>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center animate-bounce">
                            <FaCheckCircle className="text-white text-sm" />
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
              {errors.category && (
                <p className="mt-4 text-red-400 text-sm flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8 animate-fade-in-up">
            {/* Description */}
            <div className="relative">
              <div className="relative">
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={6}
                  className={`
                    peer w-full px-6 py-4 bg-white/10 backdrop-blur-md border-2 rounded-2xl
                    text-gray-800 placeholder-transparent focus:outline-none transition-all duration-300 resize-none
                    ${errors.description ? 'border-red-400' : 'border-white/20 focus:border-blue-400'}
                  `}
                  placeholder="Detailed Description"
                />
                <label className="absolute left-6 -top-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-sm font-medium px-2 peer-placeholder-shown:text-gray-700 peer-placeholder-shown:text-lg peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-blue-400 peer-focus:to-purple-400 peer-focus:bg-clip-text peer-focus:text-transparent transition-all duration-300">
                  Detailed Description *
                </label>
              </div>
              {errors.description && (
                <p className="mt-2 text-red-400 text-sm flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Priority Selection */}
            <div>
              <h3 className="text-gray-800 text-lg font-medium mb-4">Priority Level</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {priorities.map((priority, index) => {
                  const isSelected = watchedFields.priority === priority.value;
                  return (
                    <label
                      key={priority.value}
                      className={`
                        relative group cursor-pointer animate-fade-in-up
                        ${isSelected ? 'scale-105' : 'hover:scale-105'}
                        transition-all duration-300
                      `}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <input
                        type="radio"
                        {...register('priority')}
                        value={priority.value}
                        className="sr-only"
                      />
                      <div className={`
                        relative p-4 rounded-xl backdrop-blur-md border-2 transition-all duration-300 text-center
                        ${isSelected 
                          ? `${priority.bg} border-white/40 shadow-lg` 
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                        }
                      `}>
                        <span className={`font-medium transition-colors duration-200 ${
                          isSelected ? priority.color : 'text-gray-800 group-hover:text-gray-900'
                        }`}>
                          {priority.label}
                        </span>
                        
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                            <FaCheckCircle className="text-white text-xs" />
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8 animate-fade-in-up">
            {/* Image Upload */}
            <div>
              <h3 className="text-gray-800 text-lg font-medium mb-4">Upload Evidence</h3>
              <div className={`
                relative p-8 rounded-2xl backdrop-blur-md border-2 border-dashed transition-all duration-300
                ${imagePreview ? 'border-green-400/50 bg-green-500/10' : 'border-white/30 hover:border-white/50 bg-white/5'}
              `}>
                {imagePreview ? (
                  <div className="space-y-6 text-center">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-64 rounded-xl shadow-2xl"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                      >
                        <FaTimes className="text-sm" />
                      </button>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                      >
                        <FaCamera className="inline mr-2" />
                        Change Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                      <FaCamera className="text-3xl text-white/60" />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                      >
                        <FaUpload className="inline mr-2" />
                        Upload Photo
                      </button>
                      <p className="mt-3 text-gray-600 text-sm">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-gray-800 text-lg font-medium mb-4">Location Information</h3>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  className={`
                    w-full p-4 rounded-xl backdrop-blur-md border-2 transition-all duration-300
                    ${location 
                      ? 'border-green-400/50 bg-green-500/10' 
                      : 'border-white/20 hover:border-white/40 bg-white/5'
                    }
                    ${gettingLocation ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
                  `}
                >
                  <div className="flex items-center justify-center space-x-3">
                    {gettingLocation ? (
                      <FaSpinner className="text-blue-400 animate-spin" />
                    ) : location ? (
                      <FaCheckCircle className="text-green-400" />
                    ) : (
                      <FaLocationArrow className="text-blue-400" />
                    )}
                    <span className="text-white font-medium">
                      {gettingLocation ? 'Getting Location...' : location ? 'Location Captured' : 'Get Current Location'}
                    </span>
                  </div>
                  {location && (
                    <div className="mt-3 text-white/70 text-sm">
                      <FaMapMarkerAlt className="inline mr-2" />
                      Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 animate-float"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 min-h-screen flex items-center justify-center p-6 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Submit Complaint
            </h1>
            <p className="text-gray-600 text-lg">
              Help improve your city by reporting civic issues
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300
                    ${currentStep >= step 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'bg-white/20 text-gray-400 backdrop-blur-md'
                    }
                  `}>
                    {currentStep > step ? <FaCheckCircle /> : step}
                    {currentStep === step && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse opacity-50" />
                    )}
                  </div>
                  {step < 3 && (
                    <div className={`
                      w-16 h-1 rounded-full transition-all duration-300
                      ${currentStep > step 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                        : 'bg-white/20'
                      }
                    `} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`
                    px-8 py-4 rounded-xl font-medium transition-all duration-300
                    ${currentStep === 1 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md'
                    }
                  `}
                >
                  Previous
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting || !imageFile || !location}
                    className={`
                      px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2
                      ${submitting || !imageFile || !location
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg'
                      } text-white
                    `}
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>Submit Complaint</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
};

export default SubmitComplaint;
