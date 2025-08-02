const express = require('express');
const { pool } = require('../config/database');
const { verifyToken, requireManager } = require('../middleware/auth');

const router = express.Router();

// Get all animal medicines (public endpoint with filtering)
router.get('/', async (req, res) => {
    try {
        const { 
            category, 
            status = 'available', 
            search, 
            requires_prescription,
            page = 1, 
            limit = 20,
            sortBy = 'name',
            sortOrder = 'ASC'
        } = req.query;
        
        let query = 'SELECT * FROM animal_medicines WHERE 1=1';
        let countQuery = 'SELECT COUNT(*) as total FROM animal_medicines WHERE 1=1';
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
        
        if (requires_prescription !== undefined) {
            query += ' AND requires_prescription = ?';
            countQuery += ' AND requires_prescription = ?';
            params.push(requires_prescription === 'true');
        }
        
        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ? OR manufacturer LIKE ? OR active_ingredients LIKE ?)';
            countQuery += ' AND (name LIKE ? OR description LIKE ? OR manufacturer LIKE ? OR active_ingredients LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }
        
        // Add sorting
        const validSortFields = ['name', 'category', 'price', 'stock_quantity', 'expiry_date', 'created_at'];
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
        const [medicines] = await pool.execute(query, queryParams);
        const [countResult] = await pool.execute(countQuery, countParams);
        
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / parseInt(limit));
        
        res.json({
            success: true,
            data: medicines,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get animal medicines error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get medicine categories (public endpoint)
router.get('/categories', async (req, res) => {
    try {
        const [categories] = await pool.execute(
            'SELECT DISTINCT category FROM animal_medicines WHERE category IS NOT NULL ORDER BY category'
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

// Get medicines expiring soon (manager+ only)
router.get('/expiring-soon', verifyToken, requireManager, async (req, res) => {
    try {
        const { days = 30 } = req.query;
        
        const [medicines] = await pool.execute(
            `SELECT * FROM animal_medicines 
             WHERE expiry_date IS NOT NULL 
             AND expiry_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY) 
             AND expiry_date >= CURDATE()
             ORDER BY expiry_date ASC`,
            [parseInt(days)]
        );
        
        res.json({
            success: true,
            data: medicines
        });
    } catch (error) {
        console.error('Get expiring medicines error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get single animal medicine by ID (public endpoint)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [medicines] = await pool.execute(
            'SELECT * FROM animal_medicines WHERE id = ?',
            [id]
        );
        
        if (medicines.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Animal medicine not found'
            });
        }
        
        res.json({
            success: true,
            data: medicines[0]
        });
    } catch (error) {
        console.error('Get animal medicine error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Create new animal medicine (manager+ only)
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
            active_ingredients,
            dosage_instructions,
            target_animals,
            manufacturer,
            expiry_date,
            batch_number,
            requires_prescription = false,
            status = 'available'
        } = req.body;
        
        // Validate required fields
        if (!name || !category || !unit || !active_ingredients) {
            return res.status(400).json({
                success: false,
                message: 'Name, category, unit, and active ingredients are required'
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
        
        // Validate expiry_date if provided
        if (expiry_date && new Date(expiry_date) < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Expiry date cannot be in the past'
            });
        }
        
        const [result] = await pool.execute(
            `INSERT INTO animal_medicines 
             (name, description, category, price, unit, stock_quantity, image_url, 
              active_ingredients, dosage_instructions, target_animals, manufacturer, 
              expiry_date, batch_number, requires_prescription, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, category, price, unit, stock_quantity, image_url,
             active_ingredients, dosage_instructions, JSON.stringify(target_animals), 
             manufacturer, expiry_date, batch_number, requires_prescription, status]
        );
        
        // Get the created medicine
        const [newMedicine] = await pool.execute(
            'SELECT * FROM animal_medicines WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json({
            success: true,
            message: 'Animal medicine created successfully',
            data: newMedicine[0]
        });
    } catch (error) {
        console.error('Create animal medicine error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Update animal medicine (manager+ only)
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
            active_ingredients,
            dosage_instructions,
            target_animals,
            manufacturer,
            expiry_date,
            batch_number,
            requires_prescription,
            status
        } = req.body;
        
        // Check if medicine exists
        const [existingMedicine] = await pool.execute(
            'SELECT id FROM animal_medicines WHERE id = ?',
            [id]
        );
        
        if (existingMedicine.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Animal medicine not found'
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
        if (active_ingredients !== undefined) {
            updateFields.push('active_ingredients = ?');
            updateValues.push(active_ingredients);
        }
        if (dosage_instructions !== undefined) {
            updateFields.push('dosage_instructions = ?');
            updateValues.push(dosage_instructions);
        }
        if (target_animals !== undefined) {
            updateFields.push('target_animals = ?');
            updateValues.push(JSON.stringify(target_animals));
        }
        if (manufacturer !== undefined) {
            updateFields.push('manufacturer = ?');
            updateValues.push(manufacturer);
        }
        if (expiry_date !== undefined) {
            if (expiry_date && new Date(expiry_date) < new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'Expiry date cannot be in the past'
                });
            }
            updateFields.push('expiry_date = ?');
            updateValues.push(expiry_date);
        }
        if (batch_number !== undefined) {
            updateFields.push('batch_number = ?');
            updateValues.push(batch_number);
        }
        if (requires_prescription !== undefined) {
            updateFields.push('requires_prescription = ?');
            updateValues.push(requires_prescription);
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
            `UPDATE animal_medicines SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        
        // Get the updated medicine
        const [updatedMedicine] = await pool.execute(
            'SELECT * FROM animal_medicines WHERE id = ?',
            [id]
        );
        
        res.json({
            success: true,
            message: 'Animal medicine updated successfully',
            data: updatedMedicine[0]
        });
    } catch (error) {
        console.error('Update animal medicine error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Delete animal medicine (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can delete animal medicines'
            });
        }
        
        // Check if medicine exists
        const [existingMedicine] = await pool.execute(
            'SELECT id FROM animal_medicines WHERE id = ?',
            [id]
        );
        
        if (existingMedicine.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Animal medicine not found'
            });
        }
        
        await pool.execute('DELETE FROM animal_medicines WHERE id = ?', [id]);
        
        res.json({
            success: true,
            message: 'Animal medicine deleted successfully'
        });
    } catch (error) {
        console.error('Delete animal medicine error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;