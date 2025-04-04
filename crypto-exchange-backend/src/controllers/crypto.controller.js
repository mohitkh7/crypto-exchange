const { db } = require('../config/database');
const { AppError } = require('../middleware/error.middleware');

// Placeholder for BitGo SDK integration
const getCurrentPrice = async (cryptoType) => {
  // TODO: Implement BitGo SDK price fetching
  return 50000; // Placeholder price for BTC
};

const getBalance = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    db.all(
      `SELECT crypto_type, amount FROM crypto_assets WHERE user_id = ?`,
      [userId],
      (err, assets) => {
        if (err) {
          return next(new AppError('Database error', 500));
        }

        res.json({
          success: true,
          data: {
            assets: assets || []
          }
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

const getTransactionHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    db.all(
      `SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
      [userId],
      (err, transactions) => {
        if (err) {
          return next(new AppError('Database error', 500));
        }

        res.json({
          success: true,
          data: {
            transactions: transactions || []
          }
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

const buyCrypto = async (req, res, next) => {
  try {
    const { cryptoType, amount } = req.body;
    const userId = req.user.userId;

    // Get current price (placeholder)
    const price = await getCurrentPrice(cryptoType);
    const totalCost = price * amount;

    // Check user's fiat balance
    db.get(
      'SELECT fiat_balance FROM users WHERE id = ?',
      [userId],
      async (err, user) => {
        if (err) {
          return next(new AppError('Database error', 500));
        }
        if (!user || user.fiat_balance < totalCost) {
          return next(new AppError('Insufficient funds', 400));
        }

        // Start transaction
        db.run('BEGIN TRANSACTION');

        try {
          // Update user's fiat balance
          db.run(
            'UPDATE users SET fiat_balance = fiat_balance - ? WHERE id = ?',
            [totalCost, userId]
          );

          // Update or insert crypto asset
          db.run(
            `INSERT INTO crypto_assets (user_id, crypto_type, amount)
             VALUES (?, ?, ?)
             ON CONFLICT(user_id, crypto_type) DO UPDATE SET
             amount = amount + ?`,
            [userId, cryptoType, amount, amount]
          );

          // Record transaction
          db.run(
            `INSERT INTO transactions (user_id, type, crypto_type, amount, price, status)
             VALUES (?, 'buy', ?, ?, ?, 'completed')`,
            [userId, cryptoType, amount, price]
          );

          db.run('COMMIT');

          res.json({
            success: true,
            data: {
              message: 'Purchase successful',
              amount,
              price,
              totalCost
            }
          });
        } catch (error) {
          db.run('ROLLBACK');
          next(new AppError('Transaction failed', 500));
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

const sellCrypto = async (req, res, next) => {
  try {
    const { cryptoType, amount } = req.body;
    const userId = req.user.userId;

    // Get current price (placeholder)
    const price = await getCurrentPrice(cryptoType);
    const totalValue = price * amount;

    // Check user's crypto balance
    db.get(
      'SELECT amount FROM crypto_assets WHERE user_id = ? AND crypto_type = ?',
      [userId, cryptoType],
      async (err, asset) => {
        if (err) {
          return next(new AppError('Database error', 500));
        }
        if (!asset || asset.amount < amount) {
          return next(new AppError('Insufficient crypto balance', 400));
        }

        // Start transaction
        db.run('BEGIN TRANSACTION');

        try {
          // Update user's crypto balance
          db.run(
            'UPDATE crypto_assets SET amount = amount - ? WHERE user_id = ? AND crypto_type = ?',
            [amount, userId, cryptoType]
          );

          // Update user's fiat balance
          db.run(
            'UPDATE users SET fiat_balance = fiat_balance + ? WHERE id = ?',
            [totalValue, userId]
          );

          // Record transaction
          db.run(
            `INSERT INTO transactions (user_id, type, crypto_type, amount, price, status)
             VALUES (?, 'sell', ?, ?, ?, 'completed')`,
            [userId, cryptoType, amount, price]
          );

          db.run('COMMIT');

          res.json({
            success: true,
            data: {
              message: 'Sale successful',
              amount,
              price,
              totalValue
            }
          });
        } catch (error) {
          db.run('ROLLBACK');
          next(new AppError('Transaction failed', 500));
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

const getDepositAddress = async (req, res, next) => {
  try {
    const { cryptoType } = req.params;
    const userId = req.user.userId;

    // TODO: Implement BitGo SDK deposit address generation
    const depositAddress = `placeholder-${cryptoType}-address-${userId}`;

    // Store or update deposit address
    db.run(
      `INSERT OR REPLACE INTO crypto_assets (user_id, crypto_type, deposit_address)
       VALUES (?, ?, ?)`,
      [userId, cryptoType, depositAddress],
      (err) => {
        if (err) {
          return next(new AppError('Database error', 500));
        }

        res.json({
          success: true,
          data: {
            depositAddress
          }
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

const withdrawCrypto = async (req, res, next) => {
  try {
    const { cryptoType, amount, address } = req.body;
    const userId = req.user.userId;

    // Check user's crypto balance
    db.get(
      'SELECT amount FROM crypto_assets WHERE user_id = ? AND crypto_type = ?',
      [userId, cryptoType],
      async (err, asset) => {
        if (err) {
          return next(new AppError('Database error', 500));
        }
        if (!asset || asset.amount < amount) {
          return next(new AppError('Insufficient crypto balance', 400));
        }

        // TODO: Implement BitGo SDK withdrawal
        // For now, just update the balance
        db.run('BEGIN TRANSACTION');

        try {
          // Update crypto balance
          db.run(
            'UPDATE crypto_assets SET amount = amount - ? WHERE user_id = ? AND crypto_type = ?',
            [amount, userId, cryptoType]
          );

          // Record transaction
          db.run(
            `INSERT INTO transactions (user_id, type, crypto_type, amount, price, status)
             VALUES (?, 'withdraw', ?, ?, 0, 'pending')`,
            [userId, cryptoType, amount]
          );

          db.run('COMMIT');

          res.json({
            success: true,
            data: {
              message: 'Withdrawal initiated',
              amount,
              address
            }
          });
        } catch (error) {
          db.run('ROLLBACK');
          next(new AppError('Transaction failed', 500));
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBalance,
  getTransactionHistory,
  buyCrypto,
  sellCrypto,
  getDepositAddress,
  withdrawCrypto
}; 