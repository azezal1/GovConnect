const express = require('express');
const { Complaint, User } = require('../models');
const { auth, governmentOnly } = require('../middleware/auth');
const { Op, sequelize } = require('sequelize');
const { sequelize: db } = require('../config/database');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const PDFDocument = require('pdfkit');
const fs = require('fs');

const router = express.Router();

// Get complaint trends over time
router.get('/trends', auth, governmentOnly, async (req, res) => {
  try {
    const { days = '30' } = req.query;
    const numDays = parseInt(days);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);

    // Generate date range for trends
    const trends = [];
    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = await Complaint.count({
        where: {
          createdAt: {
            [Op.between]: [
              new Date(date.getFullYear(), date.getMonth(), date.getDate()),
              new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
            ]
          }
        }
      });
      
      trends.push({ date: dateStr, complaints: count });
    }

    res.json(trends);

  } catch (error) {
    console.error('Analytics trends error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get category statistics
router.get('/categories', auth, governmentOnly, async (req, res) => {
  try {
    const categories = ['admin', 'it-section', 'urban-livelihood', 'elections', 'finance', 'planning', 'public-health', 'revenue', 'engineering'];
    
    const categoryStats = await Promise.all(
      categories.map(async (category) => {
        const count = await Complaint.count({ where: { category } });
        return { name: category.replace('-', ' '), count };
      })
    );

    res.json(categoryStats.filter(stat => stat.count > 0));

  } catch (error) {
    console.error('Category stats error:', error);
    res.status(500).json({ error: 'Failed to fetch category statistics' });
  }
});

// Get status statistics
router.get('/status', auth, governmentOnly, async (req, res) => {
  try {
    const statuses = ['pending', 'verified', 'in_progress', 'resolved'];
    
    const statusStats = await Promise.all(
      statuses.map(async (status) => {
        const count = await Complaint.count({ where: { status } });
        return { status: status.replace('_', '-'), count };
      })
    );

    res.json(statusStats);

  } catch (error) {
    console.error('Status stats error:', error);
    res.status(500).json({ error: 'Failed to fetch status statistics' });
  }
});

// Get area statistics
router.get('/areas', auth, governmentOnly, async (req, res) => {
  try {
    // For now, return mock data since we don't have area classification
    const areas = [
      { area: 'Downtown', total: 45, pending: 12, inProgress: 18, resolved: 15 },
      { area: 'Residential Zone A', total: 32, pending: 8, inProgress: 12, resolved: 12 },
      { area: 'Industrial Area', total: 28, pending: 5, inProgress: 10, resolved: 13 },
      { area: 'Commercial District', total: 38, pending: 15, inProgress: 8, resolved: 15 }
    ];

    res.json(areas);

  } catch (error) {
    console.error('Area stats error:', error);
    res.status(500).json({ error: 'Failed to fetch area statistics' });
  }
});

// Get heatmap data for complaints
router.get('/heatmap', auth, governmentOnly, async (req, res) => {
  try {
    const { category, status, startDate, endDate } = req.query;
    
    const whereClause = {};
    if (category) whereClause.category = category;
    if (status) whereClause.status = status;
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const complaints = await Complaint.findAll({
      where: whereClause,
      attributes: [
        'location',
        'category',
        'status',
        'priority',
        'createdAt'
      ],
      order: [['createdAt', 'DESC']]
    });

    // Group complaints by location (rounded to 4 decimal places for clustering)
    const heatmapData = complaints.reduce((acc, complaint) => {
      const lat = Math.round(complaint.location.latitude * 10000) / 10000;
      const lng = Math.round(complaint.location.longitude * 10000) / 10000;
      const key = `${lat},${lng}`;
      
      if (!acc[key]) {
        acc[key] = {
          location: { latitude: lat, longitude: lng },
          count: 0,
          categories: {},
          priorities: {}
        };
      }
      
      acc[key].count++;
      acc[key].categories[complaint.category] = (acc[key].categories[complaint.category] || 0) + 1;
      acc[key].priorities[complaint.priority] = (acc[key].priorities[complaint.priority] || 0) + 1;
      
      return acc;
    }, {});

    res.json({
      heatmapData: Object.values(heatmapData),
      totalComplaints: complaints.length
    });

  } catch (error) {
    console.error('Heatmap error:', error);
    res.status(500).json({ error: 'Failed to fetch heatmap data' });
  }
});

// Get resolution statistics
router.get('/resolution-stats', auth, governmentOnly, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total complaints in period
    const totalComplaints = await Complaint.count({
      where: {
        createdAt: { [Op.gte]: startDate }
      }
    });

    // Resolved complaints
    const resolvedComplaints = await Complaint.count({
      where: {
        createdAt: { [Op.gte]: startDate },
        status: 'resolved'
      }
    });

    // In progress complaints
    const inProgressComplaints = await Complaint.count({
      where: {
        createdAt: { [Op.gte]: startDate },
        status: 'in_progress'
      }
    });

    // Pending complaints
    const pendingComplaints = await Complaint.count({
      where: {
        createdAt: { [Op.gte]: startDate },
        status: 'pending'
      }
    });

    // Average resolution time - simplified for SQLite
    const avgResolutionTime = await Complaint.findOne({
      where: {
        createdAt: { [Op.gte]: startDate },
        status: 'resolved',
        resolvedAt: { [Op.ne]: null }
      },
      attributes: [
        [db.fn('AVG', 
          db.literal('julianday(resolved_at) - julianday(created_at)')
        ), 'avgDays']
      ]
    });

    const resolutionRate = totalComplaints > 0 ? (resolvedComplaints / totalComplaints) * 100 : 0;

    res.json({
      totalComplaints,
      resolvedComplaints,
      inProgressComplaints,
      pendingComplaints,
      resolutionRate: Math.round(resolutionRate * 100) / 100,
      avgResolutionTime: Math.round(avgResolutionTime?.dataValues?.avgDays * 100) / 100 || 0
    });

  } catch (error) {
    console.error('Resolution stats error:', error);
    res.status(500).json({ error: 'Failed to fetch resolution statistics' });
  }
});

// Export data
router.get('/export', auth, governmentOnly, async (req, res) => {
  const { format = 'csv' } = req.query;
  
  if (format === 'csv') {
    return exportCSV(req, res);
  } else if (format === 'pdf') {
    return exportPDF(req, res);
  } else {
    return res.status(400).json({ error: 'Invalid format. Use csv or pdf.' });
  }
});

// Export complaints data to CSV
const exportCSV = async (req, res) => {
  try {
    const { category, status, startDate, endDate } = req.query;
    
    const whereClause = {};
    if (category) whereClause.category = category;
    if (status) whereClause.status = status;
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const complaints = await Complaint.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email', 'mobile']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const csvWriter = createCsvWriter({
      path: 'complaints_export.csv',
      header: [
        { id: 'id', title: 'Complaint ID' },
        { id: 'title', title: 'Title' },
        { id: 'description', title: 'Description' },
        { id: 'category', title: 'Category' },
        { id: 'status', title: 'Status' },
        { id: 'priority', title: 'Priority' },
        { id: 'location', title: 'Location' },
        { id: 'userName', title: 'Citizen Name' },
        { id: 'userEmail', title: 'Citizen Email' },
        { id: 'userMobile', title: 'Citizen Mobile' },
        { id: 'createdAt', title: 'Created Date' },
        { id: 'resolvedAt', title: 'Resolved Date' },
        { id: 'resolutionNotes', title: 'Resolution Notes' }
      ]
    });

    const records = complaints.map(complaint => ({
      id: complaint.id,
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      status: complaint.status,
      priority: complaint.priority,
      location: (() => {
        try {
          const loc = typeof complaint.location === 'string' ? JSON.parse(complaint.location) : complaint.location;
          return `${loc.latitude || loc.lat}, ${loc.longitude || loc.lng}`;
        } catch (error) {
          return 'Location unavailable';
        }
      })(),
      userName: complaint.user?.name || 'Anonymous',
      userEmail: complaint.user?.email || 'N/A',
      userMobile: complaint.user?.mobile || 'N/A',
      createdAt: complaint.createdAt.toISOString().split('T')[0],
      resolvedAt: complaint.resolvedAt ? complaint.resolvedAt.toISOString().split('T')[0] : 'N/A',
      resolutionNotes: complaint.resolutionNotes || 'N/A'
    }));

    await csvWriter.writeRecords(records);

    res.download('complaints_export.csv', 'complaints_export.csv', (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Clean up file after download
      fs.unlinkSync('complaints_export.csv');
    });

  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
};

// Export complaints data to PDF
const exportPDF = async (req, res) => {
  try {
    const { category, status, startDate, endDate } = req.query;
    
    const whereClause = {};
    if (category) whereClause.category = category;
    if (status) whereClause.status = status;
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const complaints = await Complaint.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email', 'mobile']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 100 // Limit for PDF readability
    });

    const doc = new PDFDocument();
    const filename = 'complaints_report.pdf';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    // Add title
    doc.fontSize(20).text('GovConnect - Complaints Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown();

    // Add filters info
    if (category || status || startDate || endDate) {
      doc.fontSize(14).text('Applied Filters:', { underline: true });
      if (category) doc.fontSize(12).text(`Category: ${category}`);
      if (status) doc.fontSize(12).text(`Status: ${status}`);
      if (startDate && endDate) doc.fontSize(12).text(`Date Range: ${startDate} to ${endDate}`);
      doc.moveDown();
    }

    // Add complaints table
    complaints.forEach((complaint, index) => {
      doc.fontSize(12).text(`${index + 1}. ${complaint.title}`, { underline: true });
      doc.fontSize(10).text(`Description: ${complaint.description}`);
      doc.fontSize(10).text(`Category: ${complaint.category} | Status: ${complaint.status} | Priority: ${complaint.priority}`);
      doc.fontSize(10).text(`Location: ${(() => {
        try {
          const loc = typeof complaint.location === 'string' ? JSON.parse(complaint.location) : complaint.location;
          return loc.address || `${loc.latitude || loc.lat}, ${loc.longitude || loc.lng}`;
        } catch (error) {
          return 'Location unavailable';
        }
      })()}`);
      doc.fontSize(10).text(`Citizen: ${complaint.user?.name || 'Anonymous'} (${complaint.user?.email || 'N/A'})`);
      doc.fontSize(10).text(`Created: ${complaint.createdAt.toLocaleDateString()}`);
      if (complaint.resolvedAt) {
        doc.fontSize(10).text(`Resolved: ${complaint.resolvedAt.toLocaleDateString()}`);
      }
      doc.moveDown();
    });

    doc.end();

  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ error: 'Failed to export PDF' });
  }
};

module.exports = router;
