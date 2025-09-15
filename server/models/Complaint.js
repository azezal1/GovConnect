const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Complaint = sequelize.define('Complaint', {
  id: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 1000]
    }
  },
  category: {
    type: DataTypes.ENUM('admin', 'it-section', 'urban-livelihood', 'elections', 'finance', 'planning', 'public-health', 'revenue', 'engineering'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'verified', 'in_progress', 'resolved'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      isValidLocation(value) {
        try {
          const location = typeof value === 'string' ? JSON.parse(value) : value;
          if (!location.latitude || !location.longitude || !location.address) {
            throw new Error('Location must include latitude, longitude, and address');
          }
        } catch (error) {
          throw new Error('Invalid location format');
        }
      }
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imagePublicId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  assignedTo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  assignedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolutionNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rewardPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 1000
    }
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tags: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('tags');
      try {
        return rawValue ? JSON.parse(rawValue) : [];
      } catch {
        return [];
      }
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value || []));
    }
  }
}, {
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['category']
    }
  ]
});

module.exports = Complaint;
