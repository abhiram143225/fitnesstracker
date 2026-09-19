import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Fitness Tracker REST API',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/progress', progressRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
