const WebSocket = require('ws');

// Connect to the WebSocket server
const ws = new WebSocket('ws://localhost:4000');

// Connection opened
ws.on('open', () => {
  console.log('Connected to WebSocket server');
  
  // Send a test deposit notification
  const depositNotification = {
    "hash": "0x8f11dabb53f45a3f894d7b534d204c1e1b2188355492cf49dcf757d998d5e287",
    "transfer": "67f0d8f2215ab1fe84f22ce71bec2419",
    "coin": "hteth",
    "type": "transfer",
    "state": "confirmed",
    "wallet": "67adc2acebc3a6f92625ca6e8035beee",
    "walletType": "hot",
    "transferType": "receive",
    "baseValue": 1000000000000000000,
    "baseValueString": "1000000000000000000",
    "value": 1000000000000000000,
    "valueString": "1000000000000000000",
    "feeString": "21457842000",
    "initiator": ["external"],
    "receiver": "0xb868113b246c65514ee5010b323e47970d6dcb27"
  };
  
  console.log('Sending deposit notification:', depositNotification);
  ws.send(JSON.stringify(depositNotification));
});

// Listen for messages
ws.on('message', (data) => {
  console.log('Received message from server:', data.toString());
});

// Handle errors
ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

// Connection closed
ws.on('close', () => {
  console.log('Disconnected from WebSocket server');
});

// Keep the script running
setTimeout(() => {
  console.log('Test completed, closing connection');
  ws.close();
}, 5000); 