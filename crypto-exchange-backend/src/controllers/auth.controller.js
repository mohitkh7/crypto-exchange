const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Balance = require('../models/Balance');
const { AppError } = require('../middleware/error.middleware');

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already registered', 400));
    }

    // Create new user
    const user = new User({
      email,
      password
    });

    // Save user (password will be hashed by the pre-save middleware)
    await user.save();

    // Create initial balance entry for the user
    const initialBalance = new Balance({
      user: user._id,
      asset: 'usd',
      amount: 100 // Initial amount of 100 USD
    });
    await initialBalance.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Compare password using the method defined in the User model
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return next(new AppError('Invalid credentials', 401));
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
}; 