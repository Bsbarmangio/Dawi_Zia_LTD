-- Dawi Zia LTD Database Schema
-- Drop database if exists and create new one
DROP DATABASE IF EXISTS dawi_zia_db;
CREATE DATABASE dawi_zia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dawi_zia_db;

-- Users table for authentication
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'viewer') DEFAULT 'viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Companies table for the 7 companies under Dawi Zia LTD
CREATE TABLE companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    established_year YEAR,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Raw materials table
CREATE TABLE raw_materials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    price DECIMAL(10, 2),
    unit VARCHAR(20),
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(500),
    nutritional_info JSON,
    supplier VARCHAR(100),
    origin_country VARCHAR(50),
    quality_grade ENUM('A', 'B', 'C') DEFAULT 'A',
    status ENUM('available', 'out_of_stock', 'discontinued') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Animal medicines table
CREATE TABLE animal_medicines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    price DECIMAL(10, 2),
    unit VARCHAR(20),
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(500),
    active_ingredients TEXT,
    dosage_instructions TEXT,
    target_animals JSON,
    manufacturer VARCHAR(100),
    expiry_date DATE,
    batch_number VARCHAR(50),
    requires_prescription BOOLEAN DEFAULT FALSE,
    status ENUM('available', 'out_of_stock', 'discontinued') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact inquiries table
CREATE TABLE contact_inquiries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status ENUM('new', 'in_progress', 'resolved') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Chatbot conversations table for AI features
CREATE TABLE chatbot_conversations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(100) NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    context JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_raw_materials_category ON raw_materials(category);
CREATE INDEX idx_raw_materials_status ON raw_materials(status);
CREATE INDEX idx_animal_medicines_category ON animal_medicines(category);
CREATE INDEX idx_animal_medicines_status ON animal_medicines(status);
CREATE INDEX idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX idx_chatbot_sessions ON chatbot_conversations(session_id);

-- Insert sample data for companies
INSERT INTO companies (name, description, location, phone, email, established_year) VALUES
('Dawi Feed Mill No. 1', 'Premium poultry feed manufacturing facility specializing in broiler and layer feeds', 'Addis Ababa, Ethiopia', '+251-11-234-5678', 'mill1@dawizia.com', 2010),
('Dawi Feed Mill No. 2', 'Advanced feed production with focus on organic and natural ingredients', 'Bahir Dar, Ethiopia', '+251-58-234-5679', 'mill2@dawizia.com', 2012),
('Dawi Feed Mill No. 3', 'Specialized in starter and grower feeds for young poultry', 'Hawassa, Ethiopia', '+251-46-234-5680', 'mill3@dawizia.com', 2014),
('Dawi Nutrition Center', 'Research and development facility for nutritional supplements', 'Mekelle, Ethiopia', '+251-34-234-5681', 'nutrition@dawizia.com', 2016),
('Dawi Veterinary Supplies', 'Complete veterinary medicine and healthcare solutions', 'Dire Dawa, Ethiopia', '+251-25-234-5682', 'veterinary@dawizia.com', 2015),
('Dawi Quality Assurance', 'Quality control and testing laboratory services', 'Jimma, Ethiopia', '+251-47-234-5683', 'quality@dawizia.com', 2017),
('Dawi Distribution Network', 'Nationwide distribution and logistics services', 'Adama, Ethiopia', '+251-22-234-5684', 'distribution@dawizia.com', 2018);

-- Insert sample raw materials
INSERT INTO raw_materials (name, description, category, price, unit, stock_quantity, nutritional_info, supplier, origin_country, quality_grade) VALUES
('Premium Corn', 'High-quality yellow corn for poultry feed', 'Grains', 45.50, 'kg', 5000, '{"protein": "8.5%", "moisture": "14%", "energy": "3350 kcal/kg"}', 'Ethiopian Grain Corp', 'Ethiopia', 'A'),
('Soybean Meal', 'Protein-rich soybean meal for feed formulation', 'Protein Sources', 85.75, 'kg', 3000, '{"protein": "44%", "fat": "2%", "fiber": "7%"}', 'Global Protein Ltd', 'Argentina', 'A'),
('Fish Meal', 'High-protein fish meal for enhanced nutrition', 'Protein Sources', 125.00, 'kg', 1500, '{"protein": "65%", "fat": "8%", "calcium": "5%"}', 'Coastal Fisheries', 'Peru', 'A'),
('Wheat Bran', 'Nutritious wheat bran for fiber content', 'Fiber Sources', 35.25, 'kg', 4000, '{"protein": "15%", "fiber": "12%", "phosphorus": "1.2%"}', 'Wheat Processors Inc', 'Ethiopia', 'B'),
('Limestone', 'Calcium carbonate for shell formation', 'Minerals', 25.80, 'kg', 8000, '{"calcium": "38%", "purity": "99%"}', 'Mineral Resources Ltd', 'Ethiopia', 'A');

-- Insert sample animal medicines
INSERT INTO animal_medicines (name, description, category, price, unit, stock_quantity, active_ingredients, dosage_instructions, target_animals, manufacturer, requires_prescription) VALUES
('VitaBoost Plus', 'Comprehensive vitamin and mineral supplement', 'Vitamins & Supplements', 75.50, 'bottle', 200, 'Vitamin A, D3, E, B-complex, Selenium, Zinc', '1ml per liter of drinking water', '["chickens", "turkeys", "ducks"]', 'PharmaVet Solutions', FALSE),
('ProBio Guard', 'Probiotic supplement for digestive health', 'Probiotics', 95.25, 'kg', 150, 'Lactobacillus acidophilus, Bifidobacterium', '2g per kg of feed', '["chickens", "turkeys"]', 'BioHealth Corp', FALSE),
('CocciShield', 'Coccidiosis prevention and treatment', 'Antibiotics', 145.00, 'bottle', 100, 'Amprolium Hydrochloride 20%', '1ml per 2 liters water for 5 days', '["chickens", "turkeys"]', 'VetMed International', TRUE),
('RespiClear', 'Respiratory infection treatment', 'Antibiotics', 185.75, 'bottle', 80, 'Tylosin Tartrate 10%', '0.5ml per liter water for 3-5 days', '["chickens", "turkeys", "ducks"]', 'Advanced Veterinary', TRUE),
('CalciMax', 'Calcium and phosphorus supplement', 'Minerals', 65.80, 'kg', 300, 'Calcium Carbonate, Dicalcium Phosphate', '5g per kg of feed', '["chickens", "turkeys", "ducks", "geese"]', 'Mineral Plus Ltd', FALSE);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@dawizia.com', '$2a$10$rOeWZ8qJ9ZFZq1Y9k3.EYOvGv8Y2zM.Qx1Y9k3.EYOvGv8Y2zM.Qx', 'admin');