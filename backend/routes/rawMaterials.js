const express = require('express');
const { pool } = require('../config/database');
const { verifyToken, requireManager } = require('../middleware/auth');

const router = express.Router();

// Get all raw materials (public endpoint with filtering)
router.get('/', async (req, res) => {
    try {
        const { 
            category, 
            status = 'available', 
            search, 
            page = 1, 
            limit = 20,
            sortBy = 'name',
            sortOrder = 'ASC'
        } = req.query;
        
        let query = 'SELECT * FROM raw_materials WHERE 1=1';
        let countQuery = 'SELECT COUNT(*) as total FROM raw_materials WHERE 1=1';
        let params = [];
        
        // Add filters
        if (category) {
            query += ' AND category = ?';
            countQuery += ' AND category = ?';
            params.push(category);
        }
        
        if (status) {
            query += ' AND status = ?';
            countQuery += ' AND status = ?';
            params.push(status);
        }
        
        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ? OR supplier LIKE ?)';
            countQuery += ' AND (name LIKE ? OR description LIKE ? OR supplier LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }
        
        // Add sorting
        const validSortFields = ['name', 'category', 'price', 'stock_quantity', 'created_at'];
        const validSortOrders = ['ASC', 'DESC'];
        
        if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
            query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
        } else {
            query += ' ORDER BY name ASC';
        }
        
        // Add pagination
        const offset = (parseInt(page) - 1) * parseInt(limit);
        query += ' LIMIT ? OFFSET ?';
        
        const queryParams = [...params, parseInt(limit), offset];
        const countParams = [...params];
        
        // Execute queries
        const [materials] = await pool.execute(query, queryParams);
        const [countResult] = await pool.execute(countQuery, countParams);
        
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / parseInt(limit));
        
        res.json({
            success: true,
            data: materials,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get raw materials error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get raw material categories (public endpoint)
router.get('/categories', async (req, res) => {
    try {
        const [categories] = await pool.execute(
            'SELECT DISTINCT category FROM raw_materials WHERE category IS NOT NULL ORDER BY category'
        );
        
        res.json({
            success: true,
            data: categories.map(row => row.category)
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get single raw material by ID (public endpoint)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [materials] = await pool.execute(
            'SELECT * FROM raw_materials WHERE id = ?',
            [id]
        );
        
        if (materials.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Raw material not found'
            });
        }
        
        res.json({
            success: true,
            data: materials[0]
        });
    } catch (error) {
        console.error('Get raw material error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Create new raw material (manager+ only)
router.post('/', verifyToken, requireManager, async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            price,
            unit,
            stock_quantity = 0,
            image_url,
            nutritional_info,
            supplier,
            origin_country,
            quality_grade = 'A',
            status = 'available'
        } = req.body;
        
        // Validate required fields
        if (!name || !category || !unit) {
            return res.status(400).json({
                success: false,
                message: 'Name, category, and unit are required'
            });
        }
        
        // Validate price if provided
        if (price && (isNaN(price) || price < 0)) {
            return res.status(400).json({
                success: false,
                message: 'Price must be a positive number'
            });
        }
        
        // Validate stock_quantity
        if (stock_quantity && (isNaN(stock_quantity) || stock_quantity < 0)) {
            return res.status(400).json({
                success: false,
                message: 'Stock quantity must be a non-negative number'
            });
        }
        
        const [result] = await pool.execute(
            `INSERT INTO raw_materials 
             (name, description, category, price, unit, stock_quantity, image_url, 
              nutritional_info, supplier, origin_country, quality_grade, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, category, price, unit, stock_quantity, image_url,
             JSON.stringify(nutritional_info), supplier, origin_country, quality_grade, status]
        );
        
        // Get the created material
        const [newMaterial] = await pool.execute(
            'SELECT * FROM raw_materials WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json({
            success: true,
            message: 'Raw material created successfully',
            data: newMaterial[0]
        });
    } catch (error) {
        console.error('Create raw material error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Update raw material (manager+ only)
router.put('/:id', verifyToken, requireManager, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            category,
            price,
            unit,
            stock_quantity,
            image_url,
            nutritional_info,
            supplier,
            origin_country,
            quality_grade,
            status
        } = req.body;
        
        // Check if material exists
        const [existingMaterial] = await pool.execute(
            'SELECT id FROM raw_materials WHERE id = ?',
            [id]
        );
        
        if (existingMaterial.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Raw material not found'
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
        if (category !== undefined) {
            updateFields.push('category = ?');
            updateValues.push(category);
        }
        if (price !== undefined) {
            if (isNaN(price) || price < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Price must be a positive number'
                });
            }
            updateFields.push('price = ?');
            updateValues.push(price);
        }
        if (unit !== undefined) {
            updateFields.push('unit = ?');
            updateValues.push(unit);
        }
        if (stock_quantity !== undefined) {
            if (isNaN(stock_quantity) || stock_quantity < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Stock quantity must be a non-negative number'
                });
            }
            updateFields.push('stock_quantity = ?');
            updateValues.push(stock_quantity);
        }
        if (image_url !== undefined) {
            updateFields.push('image_url = ?');
            updateValues.push(image_url);
        }
        if (nutritional_info !== undefined) {
            updateFields.push('nutritional_info = ?');
            updateValues.push(JSON.stringify(nutritional_info));
        }
        if (supplier !== undefined) {
            updateFields.push('supplier = ?');
            updateValues.push(supplier);
        }
        if (origin_country !== undefined) {
            updateFields.push('origin_country = ?');
            updateValues.push(origin_country);
        }
        if (quality_grade !== undefined) {
            updateFields.push('quality_grade = ?');
            updateValues.push(quality_grade);
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
            `UPDATE raw_materials SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        
        // Get the updated material
        const [updatedMaterial] = await pool.execute(
            'SELECT * FROM raw_materials WHERE id = ?',
            [id]
        );
        
        res.json({
            success: true,
            message: 'Raw material updated successfully',
            data: updatedMaterial[0]
        });
    } catch (error) {
        console.error('Update raw material error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Delete raw material (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can delete raw materials'
            });
        }
        
        // Check if material exists
        const [existingMaterial] = await pool.execute(
            'SELECT id FROM raw_materials WHERE id = ?',
            [id]
        );
        
        if (existingMaterial.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Raw material not found'
            });
        }
        
        await pool.execute('DELETE FROM raw_materials WHERE id = ?', [id]);
        
        res.json({
            success: true,
            message: 'Raw material deleted successfully'
        });
    } catch (error) {
        console.error('Delete raw material error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;