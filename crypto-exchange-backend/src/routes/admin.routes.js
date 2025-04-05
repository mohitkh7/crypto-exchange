const express = require('express');
const { createWallet, getWalletDetails, getAllWallets } = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

// Protect all admin routes
router.use(protect);

// Restrict to admin users only
router.use(restrictTo('admin'));

// Wallet management routes
router.post('/wallet', createWallet);
router.get('/wallet/:asset', getWalletDetails);
router.get('/wallets', getAllWallets);

module.exports = router; 