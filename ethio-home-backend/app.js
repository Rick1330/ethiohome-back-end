const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');
const interestRoutes = require('./routes/interestRoutes');
const sellingRoutes = require('./routes/sellingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const subscriptionRoutes = require('./routes/subscription');

const app = express();

// Trust proxy for secure connections (e.g., Heroku)
app.set('trust proxy', 1);

// View engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global Middlewares
app.use(helmet()); // Set security HTTP headers

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'uploads')));

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Prevent parameter pollution
app.use(hpp({ whitelist: [] }));

// Compress responses
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests. please try again later!',
});
app.use('/api', limiter); // Apply rate limit to all API routes

// View rendering routes
app.get('/verify-email/:userId', (req, res) => {
  res.render('emailVerification', {
    frontendUrl: process.env.FRONTEND_URL,
  });
});

app.get('/reset-password/:token', (req, res) => {
  res.render('passwordReset', {
    frontendUrl: process.env.FRONTEND_URL,
  });
});

// API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/interest', interestRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/selling', sellingRoutes);
app.use('/api/v1/subscription', subscriptionRoutes);

// Handle 404 Not Found errors
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
