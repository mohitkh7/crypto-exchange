const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  asset: {
    type: String,
    required: true,
    enum: ['eth', 'btc', 'usd'],
  },
  walletId: {
    type: String,
    required: true,
    unique: true,
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['hot', 'cold'],
    default: 'hot',
  },
  multisigType: {
    type: String,
    required: true,
    enum: ['tss'],
    default: 'tss',
  },
  multisigTypeVersion: {
    type: String,
    required: true,
    enum: ['MPCv2'],
    default: 'MPCv2',
  },
  receiveAddress: {
    type: String,
  },
  balance: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Compound index to ensure a user can only have one wallet per asset type
walletSchema.index({ asset: 1, isActive: 1 });

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet; 