const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const http = require('http');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const cryptoRoutes = require('./routes/crypto.routes');
const healthRoutes = require('./routes/health.routes');
const adminRoutes = require('./routes/admin.routes');
const { errorHandler } = require('./middleware/error.middleware');
const connectDB = require('./config/database');
const { initializeWebSocketServer } = require('./websocket/server');

const app = express();
const server = http.createServer(app);

// Load Swagger documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/admin', adminRoutes);
// Error handling
app.use(errorHandler);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log(`Server is about to start on port ${PORT}`);
    
    // Initialize WebSocket server
    const wss = initializeWebSocketServer(server);
    console.log('WebSocket server initialized');
    
    // Start the server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
      console.log(`WebSocket server is running on ws://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

module.exports = app; 