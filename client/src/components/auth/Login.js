import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { FaUsers, FaBuilding, FaEnvelope, FaLock, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import AnimatedInput from '../shared/AnimatedInput';
import AnimatedButton from '../shared/AnimatedButton';

const Login = () => {
  const [userType, setUserType] = useState('citizen');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const watchedEmail = watch('email');
  const watchedPassword = watch('password');

  useEffect(() => {
    setIsVisible(true);
    // Generate floating elements for background animation
    const elements = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    }));
    setFloatingElements(elements);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        if (result.userType === 'citizen') {
          navigate('/citizen');
        } else {
          navigate('/government');
        }
      } else {
        setError('root', { message: result.error });
      }
    } catch (error) {
      setError('root', { message: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 morph-bg">
        {/* Floating Elements */}
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm animate-float"
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
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className={`w-full max-w-md transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 mb-6 animate-bounce-gentle">
              <FaShieldAlt className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 gradient-text">
              Welcome Back
            </h1>
            <p className="text-white/80 text-lg">
              Sign in to access your {userType} portal
            </p>
          </div>

          {/* User Type Toggle */}
          <div className="mb-8">
            <div className="glass-effect rounded-2xl p-2 border border-white/20">
              <div className="flex relative">
                <div className={`absolute top-0 left-0 w-1/2 h-full bg-white/20 rounded-xl transition-transform duration-300 ${
                  userType === 'government' ? 'transform translate-x-full' : ''
                }`} />
                
                <button
                  type="button"
                  onClick={() => setUserType('citizen')}
                  className={`relative z-10 flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    userType === 'citizen'
                      ? 'text-white'
                      : 'text-white/70 hover:text-white/90'
                  }`}
                >
                  <FaUsers className="inline mr-2" />
                  Citizen
                </button>
                
                <button
                  type="button"
                  onClick={() => setUserType('government')}
                  className={`relative z-10 flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    userType === 'government'
                      ? 'text-white'
                      : 'text-white/70 hover:text-white/90'
                  }`}
                >
                  <FaBuilding className="inline mr-2" />
                  Government
                </button>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="glass-effect rounded-2xl p-8 border border-white/20 backdrop-blur-md">
              <div className="space-y-6">
                
                {/* Email Field */}
                <AnimatedInput
                  label="Email Address"
                  type="email"
                  icon={FaEnvelope}
                  value={watchedEmail}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  error={errors.email?.message}
                  className="animate-slide-up"
                  style={{ animationDelay: '0.1s' }}
                />

                {/* Password Field */}
                <AnimatedInput
                  label="Password"
                  type="password"
                  icon={FaLock}
                  value={watchedPassword}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  error={errors.password?.message}
                  className="animate-slide-up"
                  style={{ animationDelay: '0.2s' }}
                />

                {/* Forgot Password */}
                <div className="text-right animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <Link
                    to="/forgot-password"
                    className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Error Message */}
                {errors.root && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 animate-slide-up">
                    <p className="text-red-200 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.root.message}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <AnimatedButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  disabled={loading}
                  icon={FaArrowRight}
                  iconPosition="right"
                  className="w-full animate-slide-up"
                  style={{ animationDelay: '0.4s' }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </AnimatedButton>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <p className="text-white/80">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-white font-semibold hover:text-white/90 transition-colors duration-200 hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>

          {/* Security Badge */}
          <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="inline-flex items-center text-white/60 text-sm">
              <FaShieldAlt className="w-4 h-4 mr-2" />
              Secured with 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
