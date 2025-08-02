const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const { initDatabase } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const companiesRoutes = require('./routes/companies');
const rawMaterialsRoutes = require('./routes/rawMaterials');
const animalMedicinesRoutes = require('./routes/animalMedicines');
const contactRoutes = require('./routes/contact');
const chatbotRoutes = require('./routes/chatbot');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
        },
    },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth requests per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.'
    }
});

app.use('/api/auth', authLimiter);
app.use('/api', limiter);

// CORS configuration
const corsOptions = {
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3000',
        'http://localhost:3001'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Dawi Zia LTD API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/raw-materials', rawMaterialsRoutes);
app.use('/api/animal-medicines', animalMedicinesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chatbot', chatbotRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Dawi Zia LTD API',
        version: '1.0.0',
        endpoints: {
            auth: {
                login: 'POST /api/auth/login',
                register: 'POST /api/auth/register',
                profile: 'GET /api/auth/profile',
                verify: 'GET /api/auth/verify'
            },
            companies: {
                getAll: 'GET /api/companies',
                getOne: 'GET /api/companies/:id',
                create: 'POST /api/companies (auth required)',
                update: 'PUT /api/companies/:id (auth required)',
                delete: 'DELETE /api/companies/:id (admin only)'
            },
            rawMaterials: {
                getAll: 'GET /api/raw-materials',
                getCategories: 'GET /api/raw-materials/categories',
                getOne: 'GET /api/raw-materials/:id',
                create: 'POST /api/raw-materials (auth required)',
                update: 'PUT /api/raw-materials/:id (auth required)',
                delete: 'DELETE /api/raw-materials/:id (admin only)'
            },
            animalMedicines: {
                getAll: 'GET /api/animal-medicines',
                getCategories: 'GET /api/animal-medicines/categories',
                getExpiringSoon: 'GET /api/animal-medicines/expiring-soon (auth required)',
                getOne: 'GET /api/animal-medicines/:id',
                create: 'POST /api/animal-medicines (auth required)',
                update: 'PUT /api/animal-medicines/:id (auth required)',
                delete: 'DELETE /api/animal-medicines/:id (admin only)'
            },
            contact: {
                submit: 'POST /api/contact',
                getAll: 'GET /api/contact (auth required)',
                getOne: 'GET /api/contact/:id (auth required)',
                updateStatus: 'PUT /api/contact/:id/status (auth required)',
                delete: 'DELETE /api/contact/:id (admin only)',
                stats: 'GET /api/contact/stats/summary (auth required)'
            },
            chatbot: {
                chat: 'POST /api/chatbot/chat',
                history: 'GET /api/chatbot/history/:sessionId',
                recommend: 'POST /api/chatbot/recommend'
            }
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    
    // Database connection errors
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
        return res.status(503).json({
            success: false,
            message: 'Database connection lost'
        });
    }
    
    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
    
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        });
    }
    
    // Validation errors
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            details: error.message
        });
    }
    
    // Default error response
    res.status(error.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'development' 
            ? error.message 
            : 'Internal server error'
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Start server
const startServer = async () => {
    try {
        // Initialize database connection
        await initDatabase();
        
        app.listen(PORT, () => {
            console.log('🚀 Dawi Zia LTD API Server started successfully!');
            console.log(`📍 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            console.log(`📚 API docs: http://localhost:${PORT}/api`);
            console.log('');
            console.log('Available endpoints:');
            console.log('  • POST /api/auth/login - User login');
            console.log('  • GET  /api/companies - Get all companies');
            console.log('  • GET  /api/raw-materials - Get raw materials');
            console.log('  • GET  /api/animal-medicines - Get animal medicines');
            console.log('  • POST /api/contact - Submit contact form');
            console.log('  • POST /api/chatbot/chat - Chat with AI assistant');
            console.log('');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();