# WebSocket Server for Crypto Exchange

This directory contains the WebSocket server implementation for the Crypto Exchange platform. The WebSocket server is used to receive real-time notifications about cryptocurrency deposits.

## Overview

The WebSocket server listens for incoming messages and processes them according to their type. Currently, it supports processing cryptocurrency deposit notifications from BitGo.

## Message Format

The WebSocket server accepts messages in the following format:

```json
{
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
}
```

## Processing Logic

When a deposit notification is received, the system:

1. Checks if the message is a transfer and is confirmed
2. If transferType is "receive", looks for the receiver address
3. Finds the user with the matching deposit address
4. Updates the user's balance for the corresponding asset
5. Creates a new transaction record of type "deposit"

## Testing

A test client is provided in `test-client.js` to test the WebSocket server. To run the test client:

```bash
node src/websocket/test-client.js
```

## Integration with BitGo

This WebSocket server is designed to work with BitGo's WebSocket notifications. When BitGo detects a deposit to one of your wallets, it will send a notification to this WebSocket server.

## Security Considerations

- The WebSocket server does not require authentication for incoming messages. This is because it's designed to receive notifications from trusted sources like BitGo.
- In a production environment, you should implement additional security measures, such as:
  - IP whitelisting
  - Message signing
  - Rate limiting

## Future Enhancements

- Add support for withdrawal notifications
- Implement WebSocket authentication
- Add support for more cryptocurrency types
- Implement real-time price updates 