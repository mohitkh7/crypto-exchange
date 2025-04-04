const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const {
  buyCrypto,
  sellCrypto,
  getDepositAddress,
  withdrawCrypto,
  getBalance,
  getTransactionHistory,
  getCryptoPrice,
  getSupportedCoins
} = require('../controllers/crypto.controller');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get user's crypto balance
router.get('/balance', getBalance);

// Get transaction history
router.get('/transactions', getTransactionHistory);

// Buy cryptocurrency
router.post('/buy',
  [
    body('cryptoType').notEmpty(),
    body('amount').isFloat({ min: 0.00000001 }),
  ],
  validateRequest,
  buyCrypto
);

// Sell cryptocurrency
router.post('/sell',
  [
    body('cryptoType').notEmpty(),
    body('amount').isFloat({ min: 0.00000001 }),
  ],
  validateRequest,
  sellCrypto
);

// Get deposit address for a specific cryptocurrency
router.get('/deposit-address/:cryptoType', getDepositAddress);

// Withdraw cryptocurrency
router.post('/withdraw',
  [
    body('cryptoType').notEmpty(),
    body('amount').isFloat({ min: 0.00000001 }),
    body('address').notEmpty(),
  ],
  validateRequest,
  withdrawCrypto
);

router.get('/price/:coin', getCryptoPrice);
router.get('/supported-coins', getSupportedCoins);

module.exports = router; 