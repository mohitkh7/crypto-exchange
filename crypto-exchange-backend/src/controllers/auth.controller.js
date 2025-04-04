const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { AppError } = require('../middleware/error.middleware');

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return next(new AppError('Database error', 500));
      }
      if (user) {
        return next(new AppError('Email already registered', 400));
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      db.run(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        function(err) {
          if (err) {
            return next(new AppError('Error creating user', 500));
          }

          // Generate JWT token
          const token = jwt.sign(
            { userId: this.lastID },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
          );

          res.status(201).json({
            success: true,
            data: {
              token,
              user: {
                id: this.lastID,
                email
              }
            }
          });
        }
      );
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return next(new AppError('Database error', 500));
      }
      if (!user) {
        return next(new AppError('Invalid credentials', 401));
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return next(new AppError('Invalid credentials', 401));
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email
          }
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
}; 