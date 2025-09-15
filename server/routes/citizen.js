const express = require('express');
const { User, Complaint } = require('../models');
const { auth, citizenOnly } = require('../middleware/auth');

const router = express.Router();

// Get citizen profile
router.get('/profile', auth, citizenOnly, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update citizen profile
router.put('/profile', auth, citizenOnly, async (req, res) => {
  try {
    const { name, mobile, aadhaar } = req.body;
    
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      name: name || user.name,
      mobile: mobile || user.mobile,
      aadhaar: aadhaar || user.aadhaar
    });

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get citizen dashboard stats
router.get('/dashboard', auth, citizenOnly, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get complaint counts by status
    const totalComplaints = await Complaint.count({ where: { userId } });
    const pendingComplaints = await Complaint.count({ 
      where: { userId, status: 'pending' } 
    });
    const inProgressComplaints = await Complaint.count({ 
      where: { userId, status: 'in_progress' } 
    });
    const resolvedComplaints = await Complaint.count({ 
      where: { userId, status: 'resolved' } 
    });

    // Get total reward points
    const totalPoints = await Complaint.sum('rewardPoints', { 
      where: { userId } 
    }) || 0;

    // Get recent complaints
    const recentComplaints = await Complaint.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      stats: {
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        totalPoints
      },
      recentComplaints
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get citizen's complaint history
router.get('/complaints', auth, citizenOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = { userId: req.user.userId };
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;

    const { count, rows: complaints } = await Complaint.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      complaints,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Get citizen's reward points history
router.get('/rewards', auth, citizenOnly, async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      where: { 
        userId: req.user.userId,
        rewardPoints: { [require('sequelize').Op.gt]: 0 }
      },
      attributes: ['id', 'title', 'category', 'rewardPoints', 'createdAt', 'status'],
      order: [['createdAt', 'DESC']]
    });

    const totalPoints = complaints.reduce((sum, complaint) => sum + complaint.rewardPoints, 0);

    res.json({
      totalPoints,
      rewards: complaints
    });

  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
});

module.exports = router;
