const express = require('express');
const { pool } = require('../config/database');
const { verifyToken, requireManager } = require('../middleware/auth');

const router = express.Router();

// Submit contact inquiry (public endpoint)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, company, subject, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }
        
        // Insert inquiry into database
        const [result] = await pool.execute(
            `INSERT INTO contact_inquiries 
             (name, email, phone, company, subject, message) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, email, phone, company, subject, message]
        );
        
        // TODO: Send email notification to admin
        // This would typically use nodemailer or similar service
        
        res.status(201).json({
            success: true,
            message: 'Thank you for your inquiry. We will get back to you soon!',
            data: {
                id: result.insertId,
                name,
                email,
                subject: subject || 'General Inquiry'
            }
        });
    } catch (error) {
        console.error('Submit contact inquiry error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit inquiry. Please try again later.'
        });
    }
});

// Get all contact inquiries (manager+ only)
router.get('/', verifyToken, requireManager, async (req, res) => {
    try {
        const { 
            status, 
            search, 
            page = 1, 
            limit = 20,
            sortBy = 'created_at',
            sortOrder = 'DESC'
        } = req.query;
        
        let query = 'SELECT * FROM contact_inquiries WHERE 1=1';
        let countQuery = 'SELECT COUNT(*) as total FROM contact_inquiries WHERE 1=1';
        let params = [];
        
        // Add filters
        if (status) {
            query += ' AND status = ?';
            countQuery += ' AND status = ?';
            params.push(status);
        }
        
        if (search) {
            query += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ? OR subject LIKE ? OR message LIKE ?)';
            countQuery += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ? OR subject LIKE ? OR message LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
        }
        
        // Add sorting
        const validSortFields = ['name', 'email', 'company', 'subject', 'status', 'created_at'];
        const validSortOrders = ['ASC', 'DESC'];
        
        if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
            query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
        } else {
            query += ' ORDER BY created_at DESC';
        }
        
        // Add pagination
        const offset = (parseInt(page) - 1) * parseInt(limit);
        query += ' LIMIT ? OFFSET ?';
        
        const queryParams = [...params, parseInt(limit), offset];
        const countParams = [...params];
        
        // Execute queries
        const [inquiries] = await pool.execute(query, queryParams);
        const [countResult] = await pool.execute(countQuery, countParams);
        
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / parseInt(limit));
        
        res.json({
            success: true,
            data: inquiries,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get contact inquiries error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get single contact inquiry by ID (manager+ only)
router.get('/:id', verifyToken, requireManager, async (req, res) => {
    try {
        const { id } = req.params;
        
        const [inquiries] = await pool.execute(
            'SELECT * FROM contact_inquiries WHERE id = ?',
            [id]
        );
        
        if (inquiries.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Contact inquiry not found'
            });
        }
        
        res.json({
            success: true,
            data: inquiries[0]
        });
    } catch (error) {
        console.error('Get contact inquiry error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Update contact inquiry status (manager+ only)
router.put('/:id/status', verifyToken, requireManager, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ['new', 'in_progress', 'resolved'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: new, in_progress, resolved'
            });
        }
        
        // Check if inquiry exists
        const [existingInquiry] = await pool.execute(
            'SELECT id FROM contact_inquiries WHERE id = ?',
            [id]
        );
        
        if (existingInquiry.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Contact inquiry not found'
            });
        }
        
        // Update status
        await pool.execute(
            'UPDATE contact_inquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, id]
        );
        
        // Get updated inquiry
        const [updatedInquiry] = await pool.execute(
            'SELECT * FROM contact_inquiries WHERE id = ?',
            [id]
        );
        
        res.json({
            success: true,
            message: 'Inquiry status updated successfully',
            data: updatedInquiry[0]
        });
    } catch (error) {
        console.error('Update inquiry status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Delete contact inquiry (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can delete contact inquiries'
            });
        }
        
        // Check if inquiry exists
        const [existingInquiry] = await pool.execute(
            'SELECT id FROM contact_inquiries WHERE id = ?',
            [id]
        );
        
        if (existingInquiry.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Contact inquiry not found'
            });
        }
        
        await pool.execute('DELETE FROM contact_inquiries WHERE id = ?', [id]);
        
        res.json({
            success: true,
            message: 'Contact inquiry deleted successfully'
        });
    } catch (error) {
        console.error('Delete contact inquiry error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get inquiry statistics (manager+ only)
router.get('/stats/summary', verifyToken, requireManager, async (req, res) => {
    try {
        // Get status counts
        const [statusCounts] = await pool.execute(
            `SELECT status, COUNT(*) as count 
             FROM contact_inquiries 
             GROUP BY status`
        );
        
        // Get recent inquiries count (last 30 days)
        const [recentCount] = await pool.execute(
            `SELECT COUNT(*) as count 
             FROM contact_inquiries 
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
        );
        
        // Get total inquiries
        const [totalCount] = await pool.execute(
            'SELECT COUNT(*) as count FROM contact_inquiries'
        );
        
        res.json({
            success: true,
            data: {
                statusBreakdown: statusCounts,
                recentInquiries: recentCount[0].count,
                totalInquiries: totalCount[0].count
            }
        });
    } catch (error) {
        console.error('Get inquiry stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;