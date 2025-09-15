const express = require('express');
const { User, Complaint } = require('../models');
const { auth, governmentOnly } = require('../middleware/auth');

const router = express.Router();

// Get government official profile
router.get('/profile', auth, governmentOnly, async (req, res) => {
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

// Update government official profile
router.put('/profile', auth, governmentOnly, async (req, res) => {
  try {
    const { name, mobile, department } = req.body;
    
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      name: name || user.name,
      mobile: mobile || user.mobile,
      department: department || user.department
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

// Get government dashboard overview
router.get('/dashboard', auth, governmentOnly, async (req, res) => {
  try {
    // Get overall complaint statistics
    const totalComplaints = await Complaint.count();
    const pendingComplaints = await Complaint.count({ where: { status: 'pending' } });
    const inProgressComplaints = await Complaint.count({ where: { status: 'in_progress' } });
    const resolvedComplaints = await Complaint.count({ where: { status: 'resolved' } });

    // Get complaints assigned to this official
    const assignedComplaints = await Complaint.count({ 
      where: { assignedTo: req.user.userId } 
    });

    // Get recent complaints
    const recentComplaints = await Complaint.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Get category distribution
    const categoryStats = await Complaint.findAll({
      attributes: [
        'category',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['category'],
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'DESC']]
    });

    res.json({
      stats: {
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        assignedComplaints
      },
      recentComplaints,
      categoryStats
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get complaints assigned to this official
router.get('/assigned-complaints', auth, governmentOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = { assignedTo: req.user.userId };
    if (status) whereClause.status = status;

    const { count, rows: complaints } = await Complaint.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email', 'mobile']
        }
      ],
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
    console.error('Get assigned complaints error:', error);
    res.status(500).json({ error: 'Failed to fetch assigned complaints' });
  }
});

// Get complaints by area (for map view)
router.get('/complaints-map', auth, governmentOnly, async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    if (priority) whereClause.priority = priority;

    const complaints = await Complaint.findAll({
      where: whereClause,
      attributes: [
        'id',
        'title',
        'category',
        'status',
        'priority',
        'location',
        'createdAt',
        'imageUrl'
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ complaints });

  } catch (error) {
    console.error('Get map complaints error:', error);
    res.status(500).json({ error: 'Failed to fetch map complaints' });
  }
});

// Get complaint statistics by area
router.get('/area-stats', auth, governmentOnly, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get complaints by area (grouped by location)
    const areaStats = await Complaint.findAll({
      where: {
        createdAt: { [require('sequelize').Op.gte]: startDate }
      },
      attributes: [
        'location',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
        [require('sequelize').fn('AVG', require('sequelize').col('rewardPoints')), 'avgPoints']
      ],
      group: ['location'],
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'DESC']],
      limit: 20
    });

    res.json({ areaStats });

  } catch (error) {
    console.error('Area stats error:', error);
    res.status(500).json({ error: 'Failed to fetch area statistics' });
  }
});

// Get performance metrics for this official
router.get('/performance', auth, governmentOnly, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get complaints handled by this official
    const handledComplaints = await Complaint.count({
      where: {
        assignedTo: req.user.userId,
        createdAt: { [require('sequelize').Op.gte]: startDate }
      }
    });

    // Get resolved complaints
    const resolvedComplaints = await Complaint.count({
      where: {
        assignedTo: req.user.userId,
        status: 'resolved',
        createdAt: { [require('sequelize').Op.gte]: startDate }
      }
    });

    // Get average resolution time
    const avgResolutionTime = await Complaint.findOne({
      where: {
        assignedTo: req.user.userId,
        status: 'resolved',
        resolvedAt: { [require('sequelize').Op.ne]: null },
        createdAt: { [require('sequelize').Op.gte]: startDate }
      },
      attributes: [
        [require('sequelize').fn('AVG', 
          require('sequelize').fn('EXTRACT', 'DAY', 
            require('sequelize').literal('"resolvedAt" - "createdAt"')
          )
        ), 'avgDays']
      ]
    });

    const resolutionRate = handledComplaints > 0 ? (resolvedComplaints / handledComplaints) * 100 : 0;

    res.json({
      handledComplaints,
      resolvedComplaints,
      resolutionRate: Math.round(resolutionRate * 100) / 100,
      avgResolutionTime: Math.round(avgResolutionTime?.dataValues?.avgDays * 100) / 100 || 0
    });

  } catch (error) {
    console.error('Performance error:', error);
    res.status(500).json({ error: 'Failed to fetch performance metrics' });
  }
});

module.exports = router;
