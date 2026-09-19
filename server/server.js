import app from './app.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`[Server] Fitness Tracker API running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
