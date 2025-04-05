const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  asset: {
    type: String,
    required: true,
    enum: ['eth', 'btc', 'usd'],
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  depositAddress: {
    type: String,
    unique: true,
    sparse: true,
  },
}, {
  timestamps: true,
});

// Compound index to ensure a user can only have one balance per asset type
balanceSchema.index({ user: 1, asset: 1 }, { unique: true });

const Balance = mongoose.model('Balance', balanceSchema);

module.exports = Balance; 