const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { body, validationResult } = require('express-validator');
const { Complaint, User } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Configure Cloudinary
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'demo';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'Image size exceeds the 5MB limit. Please upload a smaller image.' 
      });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  next(err);
};

// Submit a new complaint
router.post('/', auth, upload.single('image'), handleMulterError, [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('category').isIn(['admin', 'it-section', 'urban-livelihood', 'elections', 'finance', 'planning', 'public-health', 'revenue', 'engineering']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority')
  // Location validation will be done manually after parsing
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, isAnonymous } = req.body;
    let location = req.body.location;
    
    // Parse location if it's a string
    if (typeof location === 'string') {
      try {
        location = JSON.parse(location);
      } catch (parseError) {
        console.error('Location parse error:', parseError);
        return res.status(400).json({ errors: [{ msg: 'Invalid location format. Location must be a valid JSON object.' }] });
      }
    }
    
    // Validate location object
    const locationErrors = [];
    
    if (!location || typeof location !== 'object') {
      locationErrors.push({ msg: 'Location must be a valid object.' });
    } else {
      // Check required fields
      if (location.latitude === undefined || location.latitude === null) {
        locationErrors.push({ msg: 'Latitude is required.' });
      } else if (isNaN(parseFloat(location.latitude)) || parseFloat(location.latitude) < -90 || parseFloat(location.latitude) > 90) {
        locationErrors.push({ msg: 'Latitude must be a valid number between -90 and 90.' });
      }
      
      if (location.longitude === undefined || location.longitude === null) {
        locationErrors.push({ msg: 'Longitude is required.' });
      } else if (isNaN(parseFloat(location.longitude)) || parseFloat(location.longitude) < -180 || parseFloat(location.longitude) > 180) {
        locationErrors.push({ msg: 'Longitude must be a valid number between -180 and 180.' });
      }
      
      if (!location.address || typeof location.address !== 'string' || location.address.trim() === '') {
        locationErrors.push({ msg: 'Address is required.' });
      }
    }
    
    if (locationErrors.length > 0) {
      return res.status(400).json({ errors: locationErrors });
    }
    
    const userId = req.user.userId;

    let imageUrl = null;
    let imagePublicId = null;

    // Upload image to Cloudinary if provided
    if (req.file) {
      // Check if file exists and has buffer
      if (!req.file.buffer) {
        return res.status(400).json({ errors: [{ msg: 'Invalid image file. Please upload a valid image.' }] });
      }
      
      try {
        if (isCloudinaryConfigured) {
          // Use Promise-based approach for Cloudinary upload
          const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'govconnect/complaints',
                transformation: [
                  { width: 800, height: 600, crop: 'limit' },
                  { quality: 'auto' }
                ]
              },
              (error, result) => {
                if (error) {
                  console.error('Cloudinary upload error:', error);
                  reject(new Error('Image upload failed: ' + (error.message || 'Unknown error')));
                  return;
                }
                resolve(result);
              }
            );
            
            // Handle potential errors during buffer streaming
            try {
              uploadStream.end(req.file.buffer);
            } catch (streamError) {
              console.error('Stream error:', streamError);
              reject(new Error('Error processing image data: ' + (streamError.message || 'Unknown error')));
            }
          });
          
          const result = await uploadPromise;
          imageUrl = result.secure_url;
          imagePublicId = result.public_id;
        } else {
          // For development without Cloudinary, create a placeholder URL
          console.log('Cloudinary not configured, using placeholder for image');
          imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
          imagePublicId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(400).json({ errors: [{ msg: 'Image upload failed. Please try again with a different image or reduce the image size.' }] });
      }
    }

    // Create complaint
    const complaint = await Complaint.create({
      title,
      description,
      category,
      location: JSON.stringify(location), // Ensure location is stored as string
      imageUrl,
      imagePublicId,
      userId,
      isAnonymous: isAnonymous === 'true',
      priority: req.body.priority || 'medium' // Use the priority from the request or default to medium
    });

    // Award reward points for valid complaint
    const rewardPoints = Math.floor(Math.random() * 10) + 5; // 5-15 points
    await complaint.update({ rewardPoints });

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: {
        ...complaint.toJSON(),
        rewardPoints
      }
    });

  } catch (error) {
    console.error('Complaint submission error:', error);
    res.status(500).json({ error: 'Failed to submit complaint' });
  }
});

// Get all complaints (for government officials)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'government') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { 
      page = 1, 
      limit = 20, 
      status, 
      category, 
      priority,
      startDate,
      endDate 
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    if (priority) whereClause.priority = priority;
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const { count, rows: complaints } = await Complaint.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'mobile']
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
    console.error('Get complaints error:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Get citizen's own complaints
router.get('/my-complaints', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'citizen') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const complaints = await Complaint.findAll({
      where: { userId: req.user.userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({ complaints });

  } catch (error) {
    console.error('Get my complaints error:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Get single complaint
router.get('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'mobile']
        },
        {
          model: User,
          as: 'assignedOfficial',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Check access rights
    if (req.user.userType === 'citizen' && complaint.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ complaint });

  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ error: 'Failed to fetch complaint' });
  }
});

// Update complaint status (government officials only)
router.patch('/:id/status', auth, [
  body('status').isIn(['pending', 'verified', 'in_progress', 'resolved']).withMessage('Invalid status'),
  body('resolutionNotes').optional().trim().isLength({ max: 1000 }).withMessage('Resolution notes too long')
], async (req, res) => {
  try {
    if (req.user.userType !== 'government') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, resolutionNotes } = req.body;
    const complaint = await Complaint.findByPk(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const updateData = { status };
    
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
      updateData.resolutionNotes = resolutionNotes;
    } else if (status === 'in_progress') {
      updateData.assignedTo = req.user.userId;
      updateData.assignedAt = new Date();
    }

    await complaint.update(updateData);

    res.json({
      message: 'Complaint status updated successfully',
      complaint
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Delete complaint (citizens can only delete their own)
router.delete('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Check access rights
    if (req.user.userType === 'citizen' && complaint.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete image from Cloudinary if exists
    if (complaint.imagePublicId) {
      await cloudinary.uploader.destroy(complaint.imagePublicId);
    }

    await complaint.destroy();

    res.json({ message: 'Complaint deleted successfully' });

  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({ error: 'Failed to delete complaint' });
  }
});

module.exports = router;
