import React, { useState, useEffect } from 'react';
import { 
  FaTrophy, 
  FaStar, 
  FaMedal, 
  FaGift, 
  FaFire,
  FaChevronRight,
  FaCrown
} from 'react-icons/fa';

const RewardProgress = ({ currentPoints = 0, totalComplaints = 0, resolvedComplaints = 0 }) => {
  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const rewardTiers = [
    { name: 'Civic Starter', points: 0, icon: FaStar, color: 'from-gray-400 to-gray-500', bgColor: 'from-gray-50 to-gray-100' },
    { name: 'Community Helper', points: 50, icon: FaMedal, color: 'from-blue-400 to-blue-500', bgColor: 'from-blue-50 to-blue-100' },
    { name: 'City Guardian', points: 150, icon: FaTrophy, color: 'from-green-400 to-green-500', bgColor: 'from-green-50 to-green-100' },
    { name: 'Civic Champion', points: 300, icon: FaFire, color: 'from-orange-400 to-orange-500', bgColor: 'from-orange-50 to-orange-100' },
    { name: 'City Hero', points: 500, icon: FaCrown, color: 'from-purple-400 to-purple-500', bgColor: 'from-purple-50 to-purple-100' }
  ];

  const achievements = [
    { name: 'First Report', description: 'Submit your first complaint', points: 10, unlocked: totalComplaints >= 1 },
    { name: 'Problem Solver', description: 'Get 5 complaints resolved', points: 25, unlocked: resolvedComplaints >= 5 },
    { name: 'Community Voice', description: 'Submit 10 complaints', points: 50, unlocked: totalComplaints >= 10 },
    { name: 'Civic Leader', description: 'Earn 100 reward points', points: 20, unlocked: currentPoints >= 100 },
    { name: 'Change Maker', description: 'Get 20 complaints resolved', points: 100, unlocked: resolvedComplaints >= 20 }
  ];

  useEffect(() => {
    setIsVisible(true);
    // Animate points counter
    const duration = 2000;
    const steps = 60;
    const stepValue = currentPoints / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedPoints(Math.min(Math.floor(stepValue * currentStep), currentPoints));
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedPoints(currentPoints);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [currentPoints]);

  const getCurrentTier = () => {
    for (let i = rewardTiers.length - 1; i >= 0; i--) {
      if (currentPoints >= rewardTiers[i].points) {
        return { ...rewardTiers[i], index: i };
      }
    }
    return { ...rewardTiers[0], index: 0 };
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    if (currentTier.index < rewardTiers.length - 1) {
      return rewardTiers[currentTier.index + 1];
    }
    return null;
  };

  const getProgressToNextTier = () => {
    const nextTier = getNextTier();
    if (!nextTier) return 100;
    
    const currentTier = getCurrentTier();
    const progress = ((currentPoints - currentTier.points) / (nextTier.points - currentTier.points)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progressPercentage = getProgressToNextTier();

  return (
    <div className={`space-y-6 transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      
      {/* Main Reward Card */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-float" />
        <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/5 rounded-full animate-bounce-gentle" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 bg-gradient-to-r ${currentTier.color} rounded-xl shadow-glow`}>
                <currentTier.icon className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{currentTier.name}</h3>
                <p className="text-blue-200">Current Tier</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{animatedPoints}</div>
              <div className="text-blue-200">Reward Points</div>
            </div>
          </div>

          {nextTier && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-200">Progress to {nextTier.name}</span>
                <span className="font-semibold">{currentPoints}/{nextTier.points} points</span>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-2000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
              
              <div className="text-center text-blue-200 text-sm">
                {nextTier.points - currentPoints} points to next tier
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tier Progression */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <FaTrophy className="mr-2 text-yellow-500" />
          Reward Tiers
        </h4>
        
        <div className="space-y-3">
          {rewardTiers.map((tier, index) => {
            const isUnlocked = currentPoints >= tier.points;
            const isCurrent = currentTier.index === index;
            
            return (
              <div
                key={tier.name}
                className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                  isCurrent 
                    ? `bg-gradient-to-r ${tier.bgColor} border-2 border-blue-300 shadow-glow` 
                    : isUnlocked 
                      ? 'bg-gray-50 border border-gray-200' 
                      : 'bg-gray-50/50 border border-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isUnlocked 
                      ? `bg-gradient-to-r ${tier.color} text-white` 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    <tier.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`font-semibold ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                      {tier.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {tier.points} points required
                    </div>
                  </div>
                </div>
                
                {isCurrent && (
                  <div className="flex items-center text-blue-600 font-semibold text-sm">
                    <span>Current</span>
                    <FaChevronRight className="ml-1 w-3 h-3" />
                  </div>
                )}
                
                {isUnlocked && !isCurrent && (
                  <div className="text-green-600">
                    <FaStar className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <FaGift className="mr-2 text-purple-500" />
          Achievements
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.name}
              className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-soft'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`font-semibold mb-1 ${
                    achievement.unlocked ? 'text-green-800' : 'text-gray-600'
                  }`}>
                    {achievement.name}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {achievement.description}
                  </div>
                  <div className={`text-sm font-semibold ${
                    achievement.unlocked ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    +{achievement.points} points
                  </div>
                </div>
                
                <div className={`p-2 rounded-lg ${
                  achievement.unlocked 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {achievement.unlocked ? (
                    <FaStar className="w-4 h-4" />
                  ) : (
                    <FaGift className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardProgress;
