const express = require('express');
const { pool } = require('../config/database');
const { verifyToken, requireManager } = require('../middleware/auth');

const router = express.Router();

// Get all companies (public endpoint)
router.get('/', async (req, res) => {
    try {
        const { status = 'active' } = req.query;
        
        let query = 'SELECT * FROM companies';
        let params = [];
        
        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY established_year ASC';
        
        const [companies] = await pool.execute(query, params);
        
        res.json({
            success: true,
            data: companies
        });
    } catch (error) {
        console.error('Get companies error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get single company by ID (public endpoint)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [companies] = await pool.execute(
            'SELECT * FROM companies WHERE id = ?',
            [id]
        );
        
        if (companies.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }
        
        res.json({
            success: true,
            data: companies[0]
        });
    } catch (error) {
        console.error('Get company error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Create new company (manager+ only)
router.post('/', verifyToken, requireManager, async (req, res) => {
    try {
        const {
            name,
            description,
            location,
            phone,
            email,
            website,
            logo_url,
            established_year,
            status = 'active'
        } = req.body;
        
        // Validate required fields
        if (!name || !description || !location) {
            return res.status(400).json({
                success: false,
                message: 'Name, description, and location are required'
            });
        }
        
        const [result] = await pool.execute(
            `INSERT INTO companies 
             (name, description, location, phone, email, website, logo_url, established_year, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, location, phone, email, website, logo_url, established_year, status]
        );
        
        // Get the created company
        const [newCompany] = await pool.execute(
            'SELECT * FROM companies WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json({
            success: true,
            message: 'Company created successfully',
            data: newCompany[0]
        });
    } catch (error) {
        console.error('Create company error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Update company (manager+ only)
router.put('/:id', verifyToken, requireManager, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            location,
            phone,
            email,
            website,
            logo_url,
            established_year,
            status
        } = req.body;
        
        // Check if company exists
        const [existingCompany] = await pool.execute(
            'SELECT id FROM companies WHERE id = ?',
            [id]
        );
        
        if (existingCompany.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }
        
        // Build dynamic update query
        const updateFields = [];
        const updateValues = [];
        
        if (name !== undefined) {
            updateFields.push('name = ?');
            updateValues.push(name);
        }
        if (description !== undefined) {
            updateFields.push('description = ?');
            updateValues.push(description);
        }
        if (location !== undefined) {
            updateFields.push('location = ?');
            updateValues.push(location);
        }
        if (phone !== undefined) {
            updateFields.push('phone = ?');
            updateValues.push(phone);
        }
        if (email !== undefined) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }
        if (website !== undefined) {
            updateFields.push('website = ?');
            updateValues.push(website);
        }
        if (logo_url !== undefined) {
            updateFields.push('logo_url = ?');
            updateValues.push(logo_url);
        }
        if (established_year !== undefined) {
            updateFields.push('established_year = ?');
            updateValues.push(established_year);
        }
        if (status !== undefined) {
            updateFields.push('status = ?');
            updateValues.push(status);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);
        
        await pool.execute(
            `UPDATE companies SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        
        // Get the updated company
        const [updatedCompany] = await pool.execute(
            'SELECT * FROM companies WHERE id = ?',
            [id]
        );
        
        res.json({
            success: true,
            message: 'Company updated successfully',
            data: updatedCompany[0]
        });
    } catch (error) {
        console.error('Update company error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Delete company (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can delete companies'
            });
        }
        
        // Check if company exists
        const [existingCompany] = await pool.execute(
            'SELECT id FROM companies WHERE id = ?',
            [id]
        );
        
        if (existingCompany.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }
        
        await pool.execute('DELETE FROM companies WHERE id = ?', [id]);
        
        res.json({
            success: true,
            message: 'Company deleted successfully'
        });
    } catch (error) {
        console.error('Delete company error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;