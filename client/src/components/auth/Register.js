import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaUsers, 
  FaBuilding, 
  FaArrowLeft, 
  FaArrowRight,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaIdCard,
  FaCheckCircle,
  FaShieldAlt,
  FaTimes
} from 'react-icons/fa';
import AnimatedInput from '../shared/AnimatedInput';
import AnimatedButton from '../shared/AnimatedButton';

const Register = () => {
  const [userType, setUserType] = useState('citizen');
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    trigger
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      aadhaar: '',
      password: '',
      confirmPassword: ''
    }
  });

  const watchedFields = watch();
  const totalSteps = 3;

  useEffect(() => {
    setIsVisible(true);
    // Generate floating elements for background animation
    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 15,
      delay: Math.random() * 3,
      duration: Math.random() * 8 + 8,
    }));
    setFloatingElements(elements);
  }, []);

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 1: return ['name', 'email'];
      case 2: return ['mobile', ...(userType === 'citizen' ? ['aadhaar'] : [])];
      case 3: return ['password', 'confirmPassword'];
      default: return [];
    }
  };

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      const userData = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        ...(userType === 'citizen' && { aadhaar: data.aadhaar })
      };

      const result = await registerUser(userData, userType);
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

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Personal Information';
      case 2: return 'Contact Details';
      case 3: return 'Security Setup';
      default: return 'Registration';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return 'Tell us about yourself';
      case 2: return 'How can we reach you?';
      case 3: return 'Secure your account';
      default: return 'Complete your registration';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <AnimatedInput
              label="Full Name"
              type="text"
              icon={FaUser}
              value={watchedFields.name}
              {...register('name', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              error={errors.name?.message}
            />
            <AnimatedInput
              label="Email Address"
              type="email"
              icon={FaEnvelope}
              value={watchedFields.email}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={errors.email?.message}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <AnimatedInput
              label="Mobile Number"
              type="tel"
              icon={FaPhone}
              value={watchedFields.mobile}
              {...register('mobile', {
                required: 'Mobile number is required',
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: 'Please enter a valid mobile number'
                }
              })}
              error={errors.mobile?.message}
            />
            {userType === 'citizen' && (
              <AnimatedInput
                label="Aadhaar Number (Optional)"
                type="text"
                icon={FaIdCard}
                value={watchedFields.aadhaar}
                {...register('aadhaar', {
                  pattern: {
                    value: /^[0-9]{12}$/,
                    message: 'Aadhaar must be 12 digits'
                  }
                })}
                error={errors.aadhaar?.message}
              />
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <AnimatedInput
              label="Password"
              type="password"
              icon={FaLock}
              value={watchedFields.password}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              error={errors.password?.message}
            />
            <AnimatedInput
              label="Confirm Password"
              type="password"
              icon={FaLock}
              value={watchedFields.confirmPassword}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === watchedFields.password || 'Passwords do not match'
              })}
              error={errors.confirmPassword?.message}
            />
          </div>
        );
      default:
        return null;
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
        <div className={`w-full max-w-lg transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 mb-6 animate-bounce-gentle">
              <FaShieldAlt className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 gradient-text">
              Join GovConnect
            </h1>
            <p className="text-white/80 text-lg">
              Create your {userType} account
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

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <React.Fragment key={step}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    completedSteps.has(step)
                      ? 'bg-green-500 border-green-500 text-white'
                      : currentStep === step
                        ? 'bg-white/20 border-white text-white'
                        : 'border-white/30 text-white/50'
                  }`}>
                    {completedSteps.has(step) ? (
                      <FaCheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{step}</span>
                    )}
                  </div>
                  {step < totalSteps && (
                    <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                      completedSteps.has(step) ? 'bg-green-500' : 'bg-white/30'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-4 text-center">
              <h2 className="text-xl font-bold text-white">{getStepTitle()}</h2>
              <p className="text-white/80">{getStepDescription()}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="glass-effect rounded-2xl p-8 border border-white/20 backdrop-blur-md mb-6">
              {renderStepContent()}

              {/* Error Message */}
              {errors.root && (
                <div className="mt-6 bg-red-500/20 border border-red-500/30 rounded-xl p-4 animate-slide-up">
                  <p className="text-red-200 text-sm flex items-center">
                    <FaTimes className="w-4 h-4 mr-2" />
                    {errors.root.message}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <div>
                {currentStep > 1 && (
                  <AnimatedButton
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    icon={FaArrowLeft}
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    Previous
                  </AnimatedButton>
                )}
              </div>
              
              <div>
                {currentStep < totalSteps ? (
                  <AnimatedButton
                    type="button"
                    variant="primary"
                    onClick={nextStep}
                    icon={FaArrowRight}
                    iconPosition="right"
                  >
                    Next Step
                  </AnimatedButton>
                ) : (
                  <AnimatedButton
                    type="submit"
                    variant="success"
                    loading={loading}
                    disabled={loading}
                    icon={FaCheckCircle}
                    iconPosition="right"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </AnimatedButton>
                )}
              </div>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-white/80">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-white font-semibold hover:text-white/90 transition-colors duration-200 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center text-white/60 text-sm">
              <FaShieldAlt className="w-4 h-4 mr-2" />
              Your data is protected with enterprise-grade security
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
