const express = require('express');
const { OpenAI } = require('openai');
const { pool } = require('../config/database');

const router = express.Router();

// Initialize OpenAI (will work if API key is provided)
let openai = null;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

// Generate session ID
const generateSessionId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get company and product information for context
const getCompanyContext = async () => {
    try {
        const [companies] = await pool.execute('SELECT name, description FROM companies WHERE status = "active"');
        const [rawMaterials] = await pool.execute('SELECT name, category, description FROM raw_materials WHERE status = "available" LIMIT 10');
        const [medicines] = await pool.execute('SELECT name, category, description FROM animal_medicines WHERE status = "available" LIMIT 10');
        
        return {
            companies: companies.map(c => `${c.name}: ${c.description}`),
            rawMaterials: rawMaterials.map(r => `${r.name} (${r.category}): ${r.description}`),
            medicines: medicines.map(m => `${m.name} (${m.category}): ${m.description}`)
        };
    } catch (error) {
        console.error('Error getting company context:', error);
        return { companies: [], rawMaterials: [], medicines: [] };
    }
};

// Fallback responses when OpenAI is not available
const getFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! Welcome to Dawi Zia LTD. I'm here to help you with information about our poultry feed mills, raw materials, and animal medicines. How can I assist you today?";
    }
    
    if (lowerMessage.includes('company') || lowerMessage.includes('companies') || lowerMessage.includes('about')) {
        return "Dawi Zia LTD is a group of 7 poultry feed mills providing high-quality feed, raw materials, and animal medicines. Our companies include feed mills, nutrition centers, veterinary supplies, quality assurance, and distribution networks across Ethiopia.";
    }
    
    if (lowerMessage.includes('raw material') || lowerMessage.includes('feed') || lowerMessage.includes('corn') || lowerMessage.includes('soybean')) {
        return "We offer a wide range of high-quality raw materials including premium corn, soybean meal, fish meal, wheat bran, and limestone. All our materials are carefully sourced and quality-tested to ensure optimal nutrition for poultry.";
    }
    
    if (lowerMessage.includes('medicine') || lowerMessage.includes('veterinary') || lowerMessage.includes('health') || lowerMessage.includes('treatment')) {
        return "Our veterinary division provides comprehensive animal medicines including vitamins & supplements, probiotics, antibiotics, and mineral supplements. We carry products for chickens, turkeys, ducks, and other poultry.";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
        return "You can contact us through our contact form on the website, or reach out to any of our 7 locations across Ethiopia. Each company has dedicated contact information for specific inquiries.";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('buy')) {
        return "For pricing information and purchases, please contact our sales team through the contact form or reach out to the specific company location nearest to you. We offer competitive pricing for bulk orders.";
    }
    
    return "Thank you for your question! I'm here to help with information about Dawi Zia LTD's poultry feed mills, raw materials, and animal medicines. Could you please be more specific about what you'd like to know?";
};

// Chat with bot (public endpoint)
router.post('/chat', async (req, res) => {
    try {
        const { message, sessionId: providedSessionId } = req.body;
        
        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }
        
        const sessionId = providedSessionId || generateSessionId();
        let botResponse;
        
        if (openai) {
            try {
                // Get company context for better responses
                const context = await getCompanyContext();
                
                // Get recent conversation history
                const [history] = await pool.execute(
                    `SELECT user_message, bot_response FROM chatbot_conversations 
                     WHERE session_id = ? 
                     ORDER BY created_at DESC 
                     LIMIT 5`,
                    [sessionId]
                );
                
                // Build conversation context
                let conversationHistory = '';
                if (history.length > 0) {
                    conversationHistory = history.reverse().map(h => 
                        `User: ${h.user_message}\nAssistant: ${h.bot_response}`
                    ).join('\n\n');
                }
                
                const systemPrompt = `You are a helpful customer service assistant for Dawi Zia LTD, a group of poultry feed mills in Ethiopia. 

Company Information:
- Dawi Zia LTD operates 7 companies: ${context.companies.join(', ')}

Raw Materials we offer:
${context.rawMaterials.join('\n')}

Animal Medicines we provide:
${context.medicines.join('\n')}

Instructions:
- Be friendly, professional, and helpful
- Provide accurate information about our products and services
- If you don't know specific details, suggest contacting our team
- Keep responses concise but informative
- Focus on poultry feed, raw materials, and animal medicines
- Mention relevant products when appropriate

Previous conversation:
${conversationHistory}`;

                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: message }
                    ],
                    max_tokens: 300,
                    temperature: 0.7,
                });
                
                botResponse = completion.choices[0].message.content;
            } catch (aiError) {
                console.error('OpenAI API error:', aiError);
                botResponse = getFallbackResponse(message);
            }
        } else {
            // Use fallback when OpenAI is not configured
            botResponse = getFallbackResponse(message);
        }
        
        // Save conversation to database
        await pool.execute(
            `INSERT INTO chatbot_conversations 
             (session_id, user_message, bot_response, context) 
             VALUES (?, ?, ?, ?)`,
            [sessionId, message, botResponse, JSON.stringify({ timestamp: new Date() })]
        );
        
        res.json({
            success: true,
            data: {
                sessionId,
                message: botResponse,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, I encountered an error. Please try again later.'
        });
    }
});

// Get conversation history (optional, for debugging)
router.get('/history/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        const [conversations] = await pool.execute(
            `SELECT user_message, bot_response, created_at 
             FROM chatbot_conversations 
             WHERE session_id = ? 
             ORDER BY created_at ASC`,
            [sessionId]
        );
        
        res.json({
            success: true,
            data: conversations
        });
    } catch (error) {
        console.error('Get conversation history error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get product recommendations based on query
router.post('/recommend', async (req, res) => {
    try {
        const { query, category } = req.body;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Query is required'
            });
        }
        
        let recommendations = [];
        
        // Search raw materials
        if (!category || category === 'raw_materials') {
            const [rawMaterials] = await pool.execute(
                `SELECT id, name, description, category, price, unit 
                 FROM raw_materials 
                 WHERE status = 'available' 
                 AND (name LIKE ? OR description LIKE ? OR category LIKE ?)
                 LIMIT 5`,
                [`%${query}%`, `%${query}%`, `%${query}%`]
            );
            
            recommendations.push(...rawMaterials.map(item => ({
                ...item,
                type: 'raw_material'
            })));
        }
        
        // Search medicines
        if (!category || category === 'medicines') {
            const [medicines] = await pool.execute(
                `SELECT id, name, description, category, price, unit 
                 FROM animal_medicines 
                 WHERE status = 'available' 
                 AND (name LIKE ? OR description LIKE ? OR category LIKE ? OR active_ingredients LIKE ?)
                 LIMIT 5`,
                [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
            );
            
            recommendations.push(...medicines.map(item => ({
                ...item,
                type: 'medicine'
            })));
        }
        
        res.json({
            success: true,
            data: recommendations,
            query,
            category: category || 'all'
        });
    } catch (error) {
        console.error('Get recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;