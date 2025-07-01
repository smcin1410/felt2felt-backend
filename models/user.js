const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'user'
  },
  // --- NEW: Gamification Fields ---
  points: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    default: 'New Hand'
  }
});

// Before saving a new user, check if this is the very first user.
// If it is, make them an admin.
UserSchema.pre('save', async function(next) {
  if (this.isNew) {
    const userCount = await mongoose.model('User', UserSchema).countDocuments();
    if (userCount === 0) {
      this.role = 'admin';
    }
  }
  next();
});


module.exports = mongoose.model('User', UserSchema);
