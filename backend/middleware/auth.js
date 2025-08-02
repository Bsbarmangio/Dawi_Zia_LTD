const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const [users] = await pool.execute(
            'SELECT id, username, email, role FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }

        req.user = users[0];
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

// Check if user has required role
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions.'
            });
        }

        next();
    };
};

// Check if user is admin
const requireAdmin = requireRole(['admin']);

// Check if user is admin or manager
const requireManager = requireRole(['admin', 'manager']);

module.exports = {
    verifyToken,
    requireRole,
    requireAdmin,
    requireManager
};