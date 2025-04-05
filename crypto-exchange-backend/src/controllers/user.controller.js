const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Balance = require('../models/Balance');
const { AppError } = require('../middleware/error.middleware');

/**
 * Get user profile information
 */
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select('email createdAt');
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile information
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { email, password } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return next(new AppError('Email already in use', 400));
      }
      user.email = email;
    }

    // Update password if provided
    if (password) {
      user.password = password; // Will be hashed by pre-save middleware
    }

    // Save the updated user
    await user.save();

    res.json({
      success: true,
      data: {
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          email: user.email,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's balances for all assets
 */
const getUserBalance = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Get all balances for the user
    const balances = await Balance.find({ user: userId });

    res.json({
      success: true,
      data: {
        assets: balances.map(balance => ({
          asset: balance.asset,
          amount: balance.amount
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserBalance
}; 