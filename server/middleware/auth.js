const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Check if user still exists and is active
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid token. User not found or inactive.' });
    }

    // Add user info to request
    req.user = {
      userId: user.id,
      userType: user.userType,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed.' });
  }
};

// Middleware to check if user is a citizen
const citizenOnly = (req, res, next) => {
  if (req.user.userType !== 'citizen') {
    return res.status(403).json({ error: 'Access denied. Citizens only.' });
  }
  next();
};

// Middleware to check if user is a government official
const governmentOnly = (req, res, next) => {
  if (req.user.userType !== 'government') {
    return res.status(403).json({ error: 'Access denied. Government officials only.' });
  }
  next();
};

module.exports = { auth, citizenOnly, governmentOnly };
