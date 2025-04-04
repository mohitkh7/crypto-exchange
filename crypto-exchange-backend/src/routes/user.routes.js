const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const {
  getUserProfile,
  updateUserProfile,
  getUserBalance
} = require('../controllers/user.controller');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get user profile
router.get('/profile', getUserProfile);

// Update user profile
router.put('/profile',
  [
    body('email').optional().isEmail().normalizeEmail(),
    body('password').optional().isLength({ min: 6 }),
  ],
  validateRequest,
  updateUserProfile
);

// Get user balance
router.get('/balance', getUserBalance);

module.exports = router; 