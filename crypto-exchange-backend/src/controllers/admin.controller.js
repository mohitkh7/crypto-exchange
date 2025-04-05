const Wallet = require('../models/Wallet');
const { AppError } = require('../middleware/error.middleware');

/**
 * Create a new wallet for a specific asset
 */
const createWallet = async (req, res, next) => {
  try {
    const { asset, label, walletId } = req.body;

    if (!asset || !label || !walletId) {
      return next(new AppError('Asset, label, and walletId are required', 400));
    }

    // Check if a wallet already exists for this asset
    const existingWallet = await Wallet.findOne({ asset, isActive: true });
    if (existingWallet) {
      return next(new AppError(`A wallet already exists for ${asset}`, 400));
    }

    // Check if walletId is already in use
    const existingWalletId = await Wallet.findOne({ walletId });
    if (existingWalletId) {
      return next(new AppError(`Wallet ID ${walletId} is already in use`, 400));
    }

    // Create new wallet
    const wallet = await Wallet.create({
      asset,
      walletId,
      label,
      type: 'hot',
      multisigType: 'tss',
      multisigTypeVersion: 'MPCv2',
    });

    res.status(201).json({
      success: true,
      data: {
        wallet: {
          id: wallet._id,
          asset: wallet.asset,
          walletId: wallet.walletId,
          label: wallet.label,
          receiveAddress: wallet.receiveAddress,
        },
      },
    });
  } catch (error) {
    console.error('Error creating wallet:', error);
    next(new AppError('Failed to create wallet', 500));
  }
};

/**
 * Get wallet details for a specific asset
 */
const getWalletDetails = async (req, res, next) => {
  try {
    const { asset } = req.params;

    if (!asset) {
      return next(new AppError('Asset parameter is required', 400));
    }

    // Find the active wallet for the specified asset
    const wallet = await Wallet.findOne({ asset, isActive: true });
    
    if (!wallet) {
      return next(new AppError(`No wallet found for asset: ${asset}`, 404));
    }

    res.json({
      success: true,
      data: {
        wallet: {
          id: wallet._id,
          asset: wallet.asset,
          walletId: wallet.walletId,
          label: wallet.label,
          type: wallet.type,
          multisigType: wallet.multisigType,
          multisigTypeVersion: wallet.multisigTypeVersion,
          receiveAddress: wallet.receiveAddress,
          balance: wallet.balance,
          createdAt: wallet.createdAt,
          updatedAt: wallet.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching wallet details:', error);
    next(new AppError('Failed to fetch wallet details', 500));
  }
};

/**
 * Get all wallets
 */
const getAllWallets = async (req, res, next) => {
  try {
    const wallets = await Wallet.find({ isActive: true });

    res.json({
      success: true,
      data: {
        wallets: wallets.map(wallet => ({
          id: wallet._id,
          asset: wallet.asset,
          walletId: wallet.walletId,
          label: wallet.label,
          type: wallet.type,
          multisigType: wallet.multisigType,
          multisigTypeVersion: wallet.multisigTypeVersion,
          receiveAddress: wallet.receiveAddress,
          balance: wallet.balance,
          createdAt: wallet.createdAt,
          updatedAt: wallet.updatedAt,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching wallets:', error);
    next(new AppError('Failed to fetch wallets', 500));
  }
};

module.exports = {
  createWallet,
  getWalletDetails,
  getAllWallets,
}; 