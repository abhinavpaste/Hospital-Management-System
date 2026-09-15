require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB, isDbConnected } = require('./config/db');

const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health & Root
app.get('/', (req, res) => {
  res.json({
    message: 'Hospital Management System API is running',
    dbConnected: isDbConnected(),
    endpoints: [
      '/api/stats',
      '/api/patients',
      '/api/doctors',
      '/api/appointments',
    ],
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    database: isDbConnected() ? 'connected' : 'fallback-mode',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/stats', statsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`[Hospital Management Server] running on http://localhost:${PORT}`);
});
