const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/auth.controller');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  validateRequest,
  register
);

router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validateRequest,
  login
);

module.exports = router; 