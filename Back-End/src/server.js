import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/authRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/userRoutes.js';
import newBookingRoutes from './routes/newBookingRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import tourDetailRoutes from './routes/tourDetailRoutes.js';
import guideApplicationRoutes from './routes/guideApplicationRoutes.js';
import guideRoutes from './routes/guideRoutes.js';
import guideProfileRoutes from './routes/guideProfileRoutes.js';

const app = express();

//  MIDDLEWARE
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' MongoDB Connected'))
  .catch(err => console.error(' MongoDB Error:', err));

//  USE ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/new-bookings', newBookingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tour-details', tourDetailRoutes);
app.use('/api/guide-applications', guideApplicationRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/guides', guideProfileRoutes);

//  HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'Ceylon Tours API is running', timestamp: new Date() });
});

//  404 HANDLER
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

//  ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

//  START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` API available at http://localhost:${PORT}/api`);
});
