# Crypto Exchange Backend

A Node.js Express backend application for a cryptocurrency exchange platform. This application provides APIs for user management, cryptocurrency trading, and wallet operations.

## Features

- User registration and authentication
- User profile management
- Cryptocurrency trading (buy/sell)
- Wallet management
- Deposit and withdrawal functionality
- Transaction history
- OpenAPI documentation

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- SQLite3

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crypto-exchange-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
JWT_SECRET=your-secret-key
NODE_ENV=development
```

4. Create the data directory for SQLite database:
```bash
mkdir data
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. For production:
```bash
npm start
```

The server will start on http://localhost:3000 (or the port specified in your .env file).

## API Documentation

The API documentation is available at http://localhost:3000/api-docs when the server is running. This provides a Swagger UI interface to explore and test all available endpoints.

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### User Management
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- GET /api/users/balance - Get user's fiat balance

### Crypto Operations
- GET /api/crypto/balance - Get user's crypto balance
- GET /api/crypto/transactions - Get transaction history
- POST /api/crypto/buy - Buy cryptocurrency
- POST /api/crypto/sell - Sell cryptocurrency
- GET /api/crypto/deposit-address/:cryptoType - Get deposit address
- POST /api/crypto/withdraw - Withdraw cryptocurrency

## Database Schema

The application uses SQLite3 with the following main tables:

- users - User accounts and fiat balances
- crypto_assets - User's cryptocurrency holdings
- transactions - Transaction history

## Security

- JWT-based authentication
- Password hashing using bcrypt
- Input validation and sanitization
- SQL injection prevention
- CORS enabled

## BitGo Integration

The application includes placeholders for BitGo SDK integration. To implement actual cryptocurrency operations:

1. Install the BitGo SDK:
```bash
npm install @bitgo/sdk-api
```

2. Update the crypto controller with actual BitGo SDK implementations for:
- Price fetching
- Deposit address generation
- Withdrawal processing

## Error Handling

The application includes comprehensive error handling with:
- HTTP status codes
- Detailed error messages
- Stack traces in development mode
- Transaction rollbacks for failed operations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 