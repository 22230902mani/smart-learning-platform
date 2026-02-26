require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Initialize express
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'development' ? 1000 : 100,
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/topics', require('./routes/topicRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/live-quiz', require('./routes/liveQuizRoutes'));

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Smart Adaptive Learning Platform API',
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Smart Adaptive Learning Platform API',
        version: '1.0.0',
        documentation: '/api/docs'
    });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const httpServer = require('http').createServer(app);
const socketHandler = require('./services/socketHandler');
const io = socketHandler(httpServer);

const server = httpServer.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   Smart Adaptive Learning Platform API                   ║
║                                                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║   Port: ${PORT}                                            ║
║   URL: http://localhost:${PORT}                            ║
║   Real-time: Enabled (Socket.io)                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
