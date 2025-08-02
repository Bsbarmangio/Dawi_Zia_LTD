# Dawi Zia LTD - Poultry Feed Mills Website

A modern, responsive website for Dawi Zia LTD, a group of 7 poultry feed mills in Ethiopia. Built with React.js, Node.js, MySQL, and Tailwind CSS.

## 🌟 Features

### Frontend (React.js + TypeScript)
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Homepage**: Hero section, company overview, features showcase
- **About Us**: Company mission, values, timeline, and achievements
- **Our Companies**: Dynamic listing of all 7 companies with details
- **Raw Materials**: Product catalog with search and filtering
- **Animal Medicines**: Veterinary products with categorization
- **Contact Form**: Functional contact form with validation
- **AI Chatbot**: Intelligent customer support with fallback responses
- **Responsive Design**: Optimized for all device sizes
- **SEO Optimized**: Meta tags, semantic HTML, performance optimized

### Backend (Node.js + Express.js)
- **RESTful API**: Comprehensive API endpoints for all features
- **Authentication**: JWT-based user authentication system
- **Database Integration**: MySQL with connection pooling
- **Security**: Helmet, CORS, rate limiting, input validation
- **AI Integration**: OpenAI GPT integration for chatbot (optional)
- **Error Handling**: Comprehensive error handling and logging
- **Performance**: Compression, caching headers, optimized queries

### Database (MySQL)
- **Companies**: Store information about 7 companies
- **Raw Materials**: Product catalog with categories and pricing
- **Animal Medicines**: Veterinary products with detailed information
- **Contact Inquiries**: Customer messages and inquiry tracking
- **Users**: Authentication and authorization system
- **Chatbot Conversations**: AI chat history and analytics

## 🚀 Technology Stack

### Frontend
- React.js 18+ with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API communication
- Heroicons for icons

### Backend
- Node.js with Express.js
- MySQL with mysql2 driver
- JWT for authentication
- OpenAI API for chatbot (optional)
- Security middleware (Helmet, CORS, Rate Limiting)

### Development Tools
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Nodemon for development

## 📁 Project Structure

```
dawi-zia-website/
├── frontend/                 # React.js application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Chatbot.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── CompaniesPage.tsx
│   │   │   ├── RawMaterialsPage.tsx
│   │   │   ├── AnimalMedicinesPage.tsx
│   │   │   └── ContactPage.tsx
│   │   ├── utils/           # Utilities and API
│   │   │   └── api.ts
│   │   ├── App.tsx          # Main app component
│   │   └── index.css        # Tailwind CSS
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json
├── backend/                 # Node.js API server
│   ├── config/              # Configuration files
│   │   └── database.js
│   ├── middleware/          # Custom middleware
│   │   └── auth.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── companies.js
│   │   ├── rawMaterials.js
│   │   ├── animalMedicines.js
│   │   ├── contact.js
│   │   └── chatbot.js
│   ├── server.js            # Main server file
│   ├── .env.example         # Environment variables template
│   └── package.json
├── database/                # Database schema and setup
│   └── schema.sql           # Complete database schema
└── README.md               # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- MySQL (v8.0+ recommended)
- npm or yarn package manager

### 1. Database Setup

1. **Install MySQL** if not already installed
2. **Create the database** using the provided schema:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. **Update database credentials** in backend environment variables

### 2. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=dawi_zia_db

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=24h

   # CORS Configuration
   FRONTEND_URL=http://localhost:3000

   # OpenAI API Key (optional - for AI chatbot)
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Start the backend server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend will run on `http://localhost:5000`

### 3. Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (optional):**
   ```bash
   # Create .env file in frontend directory
   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
   ```

4. **Start the frontend development server:**
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (admin only)
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/verify` - Verify JWT token

### Public Endpoints
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get company by ID
- `GET /api/raw-materials` - Get raw materials (with filters)
- `GET /api/raw-materials/categories` - Get material categories
- `GET /api/animal-medicines` - Get medicines (with filters)
- `GET /api/animal-medicines/categories` - Get medicine categories
- `POST /api/contact` - Submit contact form
- `POST /api/chatbot/chat` - Chat with AI assistant

### Protected Endpoints (Authentication Required)
- `POST /api/companies` - Create new company (manager+)
- `PUT /api/companies/:id` - Update company (manager+)
- `DELETE /api/companies/:id` - Delete company (admin only)
- `POST /api/raw-materials` - Create material (manager+)
- `PUT /api/raw-materials/:id` - Update material (manager+)
- `DELETE /api/raw-materials/:id` - Delete material (admin only)
- Similar CRUD operations for animal medicines and contact inquiries

## 🎨 Design Features

### Color Scheme
- **Primary**: Blue tones (#0ea5e9 to #0c4a6e)
- **Secondary**: Gray tones (#f8fafc to #0f172a)
- **Success**: Green (#22c55e)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)

### Typography
- **Headings**: Merriweather (serif)
- **Body Text**: Inter (sans-serif)

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Multiple variants (primary, secondary, outline)
- **Forms**: Clean inputs with focus states
- **Navigation**: Responsive with mobile menu
- **Chatbot**: Modern floating chat interface

## 🤖 AI Chatbot Features

### Capabilities
- **Smart Responses**: Context-aware conversations
- **Fallback Mode**: Works without OpenAI API key
- **Product Search**: Intelligent product recommendations
- **Company Information**: Detailed company knowledge
- **Session Management**: Maintains conversation context

### Configuration
1. **With OpenAI**: Add your API key to `OPENAI_API_KEY` in backend `.env`
2. **Without OpenAI**: Chatbot uses predefined responses and still functions

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: 1024px and above
- **Tablet**: 768px to 1023px
- **Mobile**: 320px to 767px

### Key Responsive Features
- Flexible grid layouts
- Mobile-first navigation
- Touch-friendly interfaces
- Optimized images and assets

## 🔒 Security Features

### Backend Security
- **Helmet**: Sets various HTTP headers
- **CORS**: Cross-origin resource sharing protection
- **Rate Limiting**: Prevents API abuse
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation
- **SQL Injection Protection**: Parameterized queries

### Frontend Security
- **XSS Protection**: React's built-in protection
- **HTTPS Ready**: Production-ready configuration
- **Environment Variables**: Sensitive data protection

## 🚀 Production Deployment

### Backend Deployment
1. **Environment Setup:**
   ```bash
   NODE_ENV=production
   PORT=80
   DB_HOST=your_production_db_host
   # ... other production variables
   ```

2. **Build and Start:**
   ```bash
   npm install --production
   npm start
   ```

### Frontend Deployment
1. **Build for Production:**
   ```bash
   npm run build
   ```

2. **Serve Static Files:**
   - Deploy `build/` folder to your web server
   - Configure server to serve `index.html` for all routes

### Database Deployment
1. **Create Production Database:**
   ```bash
   mysql -u username -p -h production_host < database/schema.sql
   ```

2. **Configure Connection Pooling** for production load

## 🔧 Configuration Options

### Backend Configuration
- **Port**: Server port (default: 5000)
- **Database**: MySQL connection settings
- **JWT**: Token secret and expiration
- **CORS**: Allowed origins
- **Rate Limiting**: Request limits per IP

### Frontend Configuration
- **API URL**: Backend API endpoint
- **Build Options**: React build configuration
- **Tailwind**: Custom color scheme and components

## 📊 Performance Optimization

### Backend Optimizations
- **Connection Pooling**: Efficient database connections
- **Compression**: Gzip compression for responses
- **Caching**: HTTP caching headers
- **Query Optimization**: Efficient database queries

### Frontend Optimizations
- **Code Splitting**: Dynamic imports for routes
- **Image Optimization**: Responsive images
- **Bundle Optimization**: Tree shaking and minification
- **Lazy Loading**: Components loaded on demand

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary to Dawi Zia LTD. All rights reserved.

## 📞 Support

For technical support or questions:
- **Email**: dev@dawizia.com
- **Phone**: +251-11-234-5678
- **Website**: https://www.dawizia.com

## 🎯 Future Enhancements

### Planned Features
- **User Dashboard**: Customer portal
- **Order Management**: Online ordering system
- **Inventory Tracking**: Real-time stock levels
- **Mobile App**: React Native application
- **Analytics**: Business intelligence dashboard
- **Multi-language**: Amharic language support

### Technical Improvements
- **Microservices**: Service decomposition
- **GraphQL**: Advanced API layer
- **Real-time**: WebSocket integration
- **PWA**: Progressive Web App features
- **Docker**: Containerization support

---

**Built with ❤️ for Dawi Zia LTD - Leading Poultry Solutions in Ethiopia**
