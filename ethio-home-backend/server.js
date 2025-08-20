require('dotenv').config({ path: './config.env' });
const path=require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const globalErrorHandler = require('./controllers/errorController');
const AppError=require('./utils/appError')
const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');
const interestRoutes = require('./routes/interestRoutes');
const sellingRoutes = require('./routes/sellingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const subscriptionRoutes=require('./routes/subscription');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err);
  process.exit(1);
});

const app = express();
app.set('trust proxy', 1);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet()); // Set security HTTP headers
app.use(cors()); 
app.options('*', cors());

// Body parser
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser()); 

app.use(express.static(path.join(__dirname, 'uploads')));


// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
    ]
  })
);

app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 ,
  message:"Too many requests. please try again later!"
});
app.use(limiter);

console.log(process.env.NODE_ENV);
// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/interest', interestRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/selling', sellingRoutes);
app.use('/api/v1/subscription',subscriptionRoutes);

// Handle 404 routes
app.all('*',(req, res, next) => {
 next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('DB connection successful!');
})
.catch((err) => {
  console.log('MongoDB connection error:', err);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;
const server= app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  })
});
