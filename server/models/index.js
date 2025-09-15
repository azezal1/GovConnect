const User = require('./User');
const Complaint = require('./Complaint');

// Define relationships
User.hasMany(Complaint, { 
  foreignKey: 'userId', 
  as: 'complaints',
  onDelete: 'CASCADE'
});

Complaint.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user'
});

// Government official can be assigned to complaints
User.hasMany(Complaint, { 
  foreignKey: 'assignedTo', 
  as: 'assignedComplaints'
});

Complaint.belongsTo(User, { 
  foreignKey: 'assignedTo', 
  as: 'assignedOfficial'
});

module.exports = {
  User,
  Complaint
};
