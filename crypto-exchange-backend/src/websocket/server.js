const WebSocket = require('ws');
const Balance = require('../models/Balance');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Map to store WebSocket connections
const clients = new Map();

// Initialize WebSocket server
const initializeWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');

    // Send a welcome message
    ws.send(JSON.stringify({ type: 'connection', message: 'Connected to Crypto Exchange WebSocket' }));

    // Handle incoming messages
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        console.log('Received WebSocket message:', data);

        // Process the message
        await processWebSocketMessage(data);
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Error processing message' }));
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
};

// Process incoming WebSocket messages
const processWebSocketMessage = async (data) => {
  try {
    // Check if the message is a transfer and is confirmed
    if (data.type === 'transfer' && data.state === 'confirmed') {
      // Check if it's a receive transfer
      if (data.transferType === 'receive') {
        // Extract the receiver address
        const receiverAddress = data.receiver;
        
        // Find the user with this deposit address
        const balance = await Balance.findOne({ depositAddress: receiverAddress });
        
        if (!balance) {
          console.log(`No user found with deposit address: ${receiverAddress}`);
          return;
        }
        
        // Get the user
        const user = await User.findById(balance.user);
        
        if (!user) {
          console.log(`User not found for balance: ${balance._id}`);
          return;
        }
        
        // Convert the coin type to our format (e.g., 'hteth' to 'eth')
        const asset = normalizeAssetType(data.coin);
        
        // Convert the value to a number (assuming it's in wei/satoshi)
        const amount = parseFloat(data.valueString) / 1e18; // Assuming 18 decimals for ETH
        
        // Update the user's balance
        await Balance.findOneAndUpdate(
          { user: user._id, asset },
          { $inc: { amount } },
          { upsert: true }
        );
        
        // Create a new transaction record
        await Transaction.create({
          user: user._id,
          type: 'deposit',
          asset,
          amount,
          price: 0, // We don't have price information for deposits
          status: 'completed'
        });
        
        console.log(`Processed deposit for user ${user._id}: ${amount} ${asset}`);
      }
    }
  } catch (error) {
    console.error('Error processing WebSocket message:', error);
  }
};

// Normalize asset type from BitGo format to our format
const normalizeAssetType = (coin) => {
  // Remove 'ht' prefix if present (e.g., 'hteth' -> 'eth')
  if (coin.startsWith('ht')) {
    return coin.substring(2);
  }
  
  // Map other coin types if needed
  const coinMap = {
    'btc': 'btc',
    'eth': 'eth',
    // Add more mappings as needed
  };
  
  return coinMap[coin] || coin;
};

module.exports = {
  initializeWebSocketServer
}; 