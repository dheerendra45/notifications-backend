const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes'); // User authentication routes
const eventRoutes = require('./routes/eventRoutes'); // Event-related routes
const notificationRoutes = require('./routes/notificationRoutes'); // Notification-related routes

const app = express();
const PORT = process.env.PORT || 5001; // Use environment variable for the port

// CORS Configuration - Allows requests from any origin
app.use(cors({
  origin: '*',  // Allow all origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(bodyParser.json()); // To parse JSON data

// Serve static files (including JS and assets)
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript'); // Ensure JS files are served with correct MIME type
    }
  }
}));

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/events', eventRoutes); // Event management routes (secured by auth and role middleware)
app.use('/api/notifications', notificationRoutes); // Notification-related routes

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Database connection error:', err));

// Error Handling Middleware (optional, but helpful)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
