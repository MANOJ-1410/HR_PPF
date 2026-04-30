const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      return this.role === 'superadmin'; // Only superadmin needs password initially
    }
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'candidate','hr'], 
    default: 'user', // Added 'candidate' role
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.role === 'admin';
    }
  },
  // Add name field for better UX (optional)
  name: {
    type: String,
    required: function() {
      return this.role !== 'superadmin';  // All except superadmin need names
    }
  },
  // Add field to track if admin has set their password
  hasSetPassword: {
    type: Boolean,
    default: function() {
      return this.role === 'superadmin'; // SuperAdmin already has password
    }
  },
  // Add canLogin field to control login access
  canLogin: {
    type: Boolean,
    default: function() {
      return this.role !== 'candidate';  // Candidates can't login by default
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);