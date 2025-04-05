const jwt = require('jsonwebtoken');
const { AppError } = require('./error.middleware');
const User = require('../models/User');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

const restrictTo = (...roles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('No token provided', 401);
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Fetch user from the database
      const user = await User.findById(decoded.userId);
      // if (!user || !roles.includes(user.role)) {
      //   return next(new AppError('You do not have permission to perform this action', 403));
      // }

      req.user = user; // Attach user to request
      next();
    } catch (error) {
      next(new AppError('Unauthorized', 401));
    }
  };
};

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Fetch user from the database
    User.findById(decoded.userId)
      .then(user => {
        if (!user) {
          return next(new AppError('User not found', 404));
        }
        req.user = user; // Attach user to request
        next();
      })
      .catch(err => {
        next(new AppError('Unauthorized', 401));
      });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

module.exports = {
  authenticate,
  restrictTo,
  protect
}; 