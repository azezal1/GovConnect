import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FaCamera, FaMapMarkerAlt, FaUpload, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const SubmitComplaint = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef();
  const mapRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const categories = [
    'admin',
    'it-section',
    'urban-livelihood',
    'elections',
    'finance',
    'planning',
    'public-health',
    'revenue',
    'engineering'
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical', color: 'text-red-600' }
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
      formData.append('location', JSON.stringify(location));
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit a Complaint</h1>
          <p className="text-gray-600">Help improve your city by reporting civic issues</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complaint Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of the issue"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Provide detailed information about the issue..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Priority and Anonymous */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                {...register('priority')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isAnonymous"
                {...register('isAnonymous')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isAnonymous" className="text-sm text-gray-700">
                Submit anonymously
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto max-h-64 rounded-lg shadow-sm"
                  />
                  <div className="flex justify-center space-x-3">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <FaCamera className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaUpload className="inline mr-2" />
                      Choose Photo
                    </button>
                    <p className="mt-2 text-sm text-gray-500">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="space-y-3">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <FaMapMarkerAlt />
                  <span>Get Current Location</span>
                </button>
              </div>
              
              {location && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-800">
                    <FaMapMarkerAlt />
                    <span className="font-medium">Location captured:</span>
                    <span>Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Complaint</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
