require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Running',
    backend: 'EventSphere API Server',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/auth', require('./routes/uploadRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Start server function
const startServer = async () => {
  // Connect to MongoDB Atlas
  const dbConnected = await connectDB();
  
  if (dbConnected) {
    console.log('🚀 Starting server WITH database connection...');
  } else {
    console.log('⚠️  Starting server WITHOUT database connection.');
    console.log('   API routes that require DB will fail.');
  }
  
  // Start listening
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🔗 CORS enabled for: http://localhost:3000, http://localhost:5173`);
  });
};

// Start the server
startServer();

module.exports = app;
