import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server folder
dotenv.config({ path: path.resolve(__dirname, '.env') });

import connectDB from './config/db.js';

// Connect to MongoDB
connectDB();

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
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/uploads', uploadRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🔗 CORS enabled for: http://localhost:3000, http://localhost:5173`);
});

export default app;
