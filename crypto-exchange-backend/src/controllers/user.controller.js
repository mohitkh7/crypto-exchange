const bcrypt = require('bcryptjs');
const { db } = require('../config/database');
const { AppError } = require('../middleware/error.middleware');

/**
 * Get user profile information
 */
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    db.get(
      'SELECT id, email, fiat_balance, created_at FROM users WHERE id = ?',
      [userId],
      (err, user) => {
        if (err) {
          return next(new AppError('Database error', 500));
        }
        if (!user) {
          return next(new AppError('User not found', 404));
        }

        res.json({
          success: true,
          data: {
            user
          }
        });
      }
    );
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

    // Check if email is already taken by another user
    if (email) {
      db.get(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId],
        async (err, existingUser) => {
          if (err) {
            return next(new AppError('Database error', 500));
          }
          if (existingUser) {
            return next(new AppError('Email already in use', 400));
          }

          // Continue with update
          updateUser();
        }
      );
    } else {
      // No email update, continue with update
      updateUser();
    }

    function updateUser() {
      let updateFields = [];
      let updateValues = [];

      if (email) {
        updateFields.push('email = ?');
        updateValues.push(email);
      }

      if (password) {
        updateFields.push('password = ?');
        updateValues.push(password);
      }

      if (updateFields.length === 0) {
        return next(new AppError('No fields to update', 400));
      }

      // Add updated_at timestamp
      updateFields.push('updated_at = CURRENT_TIMESTAMP');

      // Add user ID to values array
      updateValues.push(userId);

      const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

      db.run(query, updateValues, async function(err) {
        if (err) {
          return next(new AppError('Error updating user', 500));
        }

        if (this.changes === 0) {
          return next(new AppError('User not found', 404));
        }

        // If password was updated, hash it
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          db.run(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId],
            (err) => {
              if (err) {
                return next(new AppError('Error updating password', 500));
              }
              sendResponse();
            }
          );
        } else {
          sendResponse();
        }
      });
    }

    function sendResponse() {
      // Get updated user data
      db.get(
        'SELECT id, email, fiat_balance, created_at FROM users WHERE id = ?',
        [userId],
        (err, user) => {
          if (err) {
            return next(new AppError('Database error', 500));
          }

          res.json({
            success: true,
            data: {
              message: 'Profile updated successfully',
              user
            }
          });
        }
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's fiat balance
 */
const getUserBalance = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    db.get(
      'SELECT fiat_balance FROM users WHERE id = ?',
      [userId],
      (err, user) => {
        if (err) {
          return next(new AppError('Database error', 500));
        }
        if (!user) {
          return next(new AppError('User not found', 404));
        }

        res.json({
          success: true,
          data: {
            balance: user.fiat_balance
          }
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserBalance
}; 