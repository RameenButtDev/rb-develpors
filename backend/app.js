const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const rateLimit = require('./middleware/rateLimiter');
const authRoutes = require('./routes/authRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Standard middleware for API security and parsing.
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ 
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true 
}));
app.use(mongoSanitize());
app.use(xss());

// Rate limit authentication routes to protect from brute-force attacks.
app.use('/api/auth', rateLimit.authLimiter);

// Health check endpoint.
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'RB Developers API is healthy' });
});

// API routes.
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/properties', propertyRoutes);

// 404 and global error handlers.
app.use(notFound);
app.use(errorHandler);

module.exports = app;
