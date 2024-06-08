const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Create a schema for user model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter name here.'],
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Please enter username here.'],
  },
  password: {
    type: String,
    required: [true, 'Please enter password here.'],
    select: false,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ['rater', 'researcher', 'admin'],
    default: 'rater',
  },

  passwordChangedAt: Date,
});

// Hash password when creating users
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 15);
  next();
});

// Check incoming password when login
userSchema.methods.correctPassword = async function (
  incomingPassword,
  userPassword
) {
  return await bcrypt.compare(incomingPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
