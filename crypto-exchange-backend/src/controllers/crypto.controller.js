const axios = require('axios');
const { AppError } = require('../middleware/error.middleware');
const User = require('../models/User');
const Balance = require('../models/Balance');
const Transaction = require('../models/Transaction');

const NodeCache = require('node-cache');

// Create a cache instance
const cache = new NodeCache({ stdTTL: process.env.CACHE_TTL_IN_SECONDS });

// List of supported cryptocurrencies
const supportedCoins = ['eth', 'btc'];

// Placeholder for BitGo SDK integration
const getCurrentPrice = async (coin) => {
  const key = coin.toLowerCase();

  // Try getting from cache
  const cachedPrice = cache.get(key);
  if (cachedPrice !== undefined) {
    return cachedPrice;
  }

  // Fetch price data from BitGo API
  const response = await axios.get(`https://app.bitgo.com/api/v2/market/latest?coin=${coin.toLowerCase()}`);
    
  // Extract the USD price from the response
  const marketData = response.data.marketData[0];
  const usdPrice = marketData.currencies.USD.last;

  // Store in cache
  cache.set(key, usdPrice);

  return usdPrice;
};

const getBalance = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const assets = await Balance.find({ user: userId });

    res.json({
      success: true,
      data: {
        assets: assets || []
      }
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const transactions = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: {
        transactions: transactions || []
      }
    });
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
    const balance = await Balance.findOne({ user: userId, asset: 'usd' });
    if (!balance || balance.amount < totalCost) {
      return next(new AppError('Insufficient funds', 400));
    }

    try {
      // Update user's fiat balance
      balance.amount -= totalCost;
      await balance.save();

      // Update or insert crypto asset
      await Balance.findOneAndUpdate(
        { user: userId, asset: cryptoType },
        { $inc: { amount: amount } },
        { upsert: true }
      );

      // Record transaction
      await Transaction.create([{
        user: userId,
        type: 'buy',
        asset: cryptoType,
        amount,
        price,
        status: 'completed'
      }]);


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
      console.log(error);
      next(new AppError('Transaction failed', 500));
    }
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
    const asset = await Balance.findOne({ user: userId, asset: cryptoType });
    if (!asset || asset.amount < amount) {
      return next(new AppError('Insufficient crypto balance', 400));
    }

    try {
      // Update user's crypto balance
      await Balance.findOneAndUpdate(
        { user: userId, asset: cryptoType },
        { $inc: { amount: -amount } },
      );

      // Update user's fiat balance
      const balance = await Balance.findOne({ user: userId, asset: 'usd' });
      if (!balance) {
        return next(new AppError('USD balance not found', 404));
      }
      balance.amount += totalValue;
      await balance.save();

      // Record transaction
      await Transaction.create([{
        user: userId,
        type: 'sell',
        asset: cryptoType,
        amount,
        price,
        status: 'completed'
      }]);

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
      next(new AppError('Transaction failed', 500));
    }
    
  } catch (error) {
    next(error);
  }
};

const getDepositAddress = async (req, res, next) => {
  try {
    const { cryptoType } = req.params;
    const userId = req.user.userId;

    // Check if a deposit address already exists for the user and asset
    const balance = await Balance.findOne({ user: userId, asset: cryptoType });
    
    if (balance && balance.depositAddress) {
      // If deposit address exists, return it
      return res.json({
        success: true,
        data: {
          depositAddress: balance.depositAddress
        }
      });
    }

    // Generate a new deposit address (placeholder logic)
    const depositAddress = `placeholder-${cryptoType}-address-${userId}`;

    // Store or update deposit address
    await Balance.findOneAndUpdate(
      { user: userId, asset: cryptoType },
      { depositAddress },
      { upsert: true }
    );

    res.json({
      success: true,
      data: {
        depositAddress
      }
    });
  } catch (error) {
    next(error);
  }
};

const withdrawCrypto = async (req, res, next) => {
  try {
    const { cryptoType, amount, address } = req.body;
    const userId = req.user.userId;

    // Check user's crypto balance
    const asset = await Balance.findOne({ user: userId, asset: cryptoType });
    if (!asset || asset.amount < amount) {
      return next(new AppError('Insufficient crypto balance', 400));
    }

    // TODO: Implement BitGo SDK withdrawal
    // For now, just update the balance

    try {
      // Update crypto balance
      await Balance.findOneAndUpdate(
        { user: userId, asset: cryptoType },
        { $inc: { amount: -amount } },
      );

      // Record transaction
      await Transaction.create([{
        user: userId,
        type: 'withdraw',
        asset: cryptoType,
        amount,
        price: 0,
        status: 'pending'
      }]);


      res.json({
        success: true,
        data: {
          message: 'Withdrawal initiated',
          amount,
          address
        }
      });
    } catch (error) {
      next(new AppError('Transaction failed', 500));
    }
  } catch (error) {
    next(error);
  }
};

const getCryptoPrice = async (req, res) => {
  try {
    const { coin } = req.params;    
    // Validate if the requested coin is supported
    if (!coin || !supportedCoins.includes(coin.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Unsupported cryptocurrency. Supported coins are: ${supportedCoins.join(', ')}`
      });
    }

    const usdPrice = await getCurrentPrice(coin);
    
    return res.status(200).json({
      success: true,
      data: {
        coin: coin.toLowerCase(),
        price: usdPrice,
        currency: 'USD',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch cryptocurrency price',
      error: error.message
    });
  }
};

const getSupportedCoins = (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      supportedCoins
    }
  });
};

module.exports = {
  getBalance,
  getTransactionHistory,
  buyCrypto,
  sellCrypto,
  getDepositAddress,
  withdrawCrypto,
  getCryptoPrice,
  getSupportedCoins
}; 