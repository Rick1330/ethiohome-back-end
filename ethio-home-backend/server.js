require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Determine DB connection string based on environment
const DB = process.env.NODE_ENV === 'test'
  ? process.env.DATABASE_TEST
  : process.env.DATABASE;

if (!DB) {
    console.error("ERROR: DATABASE or DATABASE_TEST environment variable not set in config.env.");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('DB connection successful!'));

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = server; // Export server for testing
