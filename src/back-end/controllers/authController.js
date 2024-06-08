const asyncCatch = require('../utils/asyncCatch');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('./../utils/appError');
const Project = require('../models/projectModel');
const { promisify } = require('util');
const verifyDocAccess = require('../utils/verifyDocAccess');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.login = asyncCatch(async (req, res, next) => {
  const { username, password } = req.body;

  // Check if username and password exist
  if (!username || !password) {
    return next(new AppError('Please provide username and password.', 400));
  }

  // Check if user exists and password is correct
  const user = await User.findOne({ username }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect username or password', 401));
  }
  // Send token to client
  createSendToken(user, 200, req, res);
});

exports.protect = asyncCatch(async (req, res, next) => {
  // Check if token exists
  let token;
  // Retrieve authorisation token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Please log in to get access.', 401));
  }

  // Obtain verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user with this token does not exist.', 401));
  }

  // Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
  // Grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have access to perform this operation.", 403)
      );
    }
    next();
  };
};

exports.updatePassword = asyncCatch(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.newPassword;
  user.passwordChangedAt = Date.now() - 1000;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});

// Check if a user has access to a particular document
exports.checkAccess = (Model) =>
  asyncCatch(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    if (verifyDocAccess(req, res, next, doc)) {
      return next(
        new AppError('Unauthorised user accessing this document', 403)
      );
    }
    next();
  });
// Check if a user has access to a particular module
exports.checkModuleAccess = (Module) =>
  asyncCatch(async (req, res, next) => {
    const myModule = await Module.findById(req.params.id);
    if (!myModule) {
      return next(new AppError('No document found with that ID', 404));
    }
    const projectId = myModule.projectId;
    const project = await Project.findById(projectId);
    if (!project) {
      return next(
        new AppError('No project associated with this module found ', 404)
      );
    }

    if (verifyDocAccess(req, res, next, project)) {
      return next(
        new AppError('Unauthorised user accessing this document', 403)
      );
    }
    next();
  });
