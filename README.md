# Stock Trading Platform

A comprehensive, modern stock trading platform built for Indian traders. This full-stack application provides real-time stock data, portfolio management, trading capabilities, and an intuitive user interface designed for both beginners and experienced traders.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Version History](#version-history)
- [Project Requirements](#project-requirements)
- [First Principles](#first-principles)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 Overview

The Stock Trading Platform is a full-stack web application designed to democratize stock trading for Indian investors. It provides real-time market data, portfolio tracking, order management, and comprehensive analytics to help traders make informed investment decisions.

### Key Highlights

- **Real-time Stock Data**: Live market updates via WebSocket connections
- **Portfolio Management**: Track holdings, positions, and orders in one place
- **Modern UI/UX**: Responsive design with smooth animations
- **Secure Authentication**: JWT-based authentication with Google OAuth support
- **Real-time Analytics**: Comprehensive portfolio analytics and performance tracking

## ✨ Features

### Frontend (Landing Page)
- Modern, responsive landing page
- User authentication (Signup/Login)
- About, Pricing, Support, and Utilities pages
- Animated testimonials and statistics
- Google OAuth integration

### Dashboard
- **Real-time Stock Watchlist**: Live updates with WebSocket integration
- **Portfolio Dashboard**: Overview of investments, returns, and performance
- **Order Management**: Place, track, and manage buy/sell orders
- **Holdings & Positions**: Detailed view of portfolio holdings
- **Stock Detail Pages**: Comprehensive stock information with charts
- **Analytics**: Portfolio analytics with visualizations
- **Responsive Design**: Mobile-first approach with collapsible sidebar

### Backend
- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- WebSocket server for real-time updates
- JWT authentication
- Google OAuth 2.0 integration
- Email verification system
- Stock data integration with Yahoo Finance API

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite 6** - Fast build tool and dev server
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **AOS** - Animate On Scroll library

### Dashboard
- **React 18** - React framework
- **Vite 6** - Build tool
- **Tailwind CSS 3** - CSS framework
- **Material-UI** - Component library
- **Chart.js** - Data visualization
- **Lightweight Charts** - Financial charts
- **Socket.io Client** - WebSocket client
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8** - MongoDB ODM
- **Socket.io 4** - WebSocket server
- **JWT** - Authentication
- **Passport.js** - Authentication middleware
- **Yahoo Finance API** - Stock data
- **Nodemailer** - Email service
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
Stock Trading Platform/
├── frontend/                 # Landing page frontend
│   ├── public/
│   │   └── images/          # Static images
│   └── src/
│       ├── landing_page/     # Landing page components
│       ├── components/       # Shared components
│       └── context/          # React contexts
│
├── dashboard/                # Trading dashboard frontend
│   ├── public/
│   │   └── images/          # Static assets
│   └── src/
│       ├── components/      # Dashboard components
│       ├── context/         # React contexts
│       ├── services/        # API services
│       └── styles/          # CSS files
│
└── backend/                 # Node.js backend server
    ├── controllers/         # Route controllers
    ├── models/              # Database models
    ├── routes/              # API routes
    ├── schema/              # Database schemas
    ├── seed/                # Database seed files
    └── middleware/          # Custom middleware
```

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm**
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **Git**

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Stock-Trading-Platform
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Install Dashboard Dependencies**
   ```bash
   cd ../dashboard
   npm install
   ```

5. **Set up Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:5173
   DASHBOARD_URL=http://localhost:5174
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

6. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:3000`

7. **Start the Frontend (Landing Page)**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

8. **Start the Dashboard**
   ```bash
   cd dashboard
   npm run dev
   ```
   The dashboard will run on `http://localhost:5174`

### Database Setup

1. **Local MongoDB**: Ensure MongoDB is running locally
2. **MongoDB Atlas**: Update the `MONGO_URL` in `.env` with your Atlas connection string
3. **Seed Database** (Optional): Run seed scripts to populate initial data

## 📚 Version History

### Version 3.0 (Current)
- **Enhanced Real-time Features**: Improved WebSocket performance and reliability
- **Advanced Analytics**: New portfolio analytics dashboard with visualizations
- **Mobile Optimization**: Enhanced mobile experience with responsive sidebar
- **Performance Improvements**: Optimized rendering and data fetching
- **Security Enhancements**: Improved authentication and session management
- **UI/UX Refinements**: Modern design updates and animations

### Version 2.0
- **Dashboard Redesign**: Complete UI overhaul with modern components
- **Real-time Stock Updates**: WebSocket integration for live market data
- **Portfolio Management**: Comprehensive holdings and positions tracking
- **Order Management System**: Buy/sell order functionality
- **Chart Integration**: Advanced financial charts using Lightweight Charts
- **Responsive Design**: Mobile-first responsive layout

### Version 1.0
- **Initial Release**: Basic trading platform functionality
- **User Authentication**: Signup, login, and password reset
- **Stock Data**: Basic stock information display
- **Portfolio Tracking**: Basic portfolio overview
- **Landing Page**: Marketing website with features showcase

## 📋 Project Requirements

### Functional Requirements

1. **User Management**
   - User registration and authentication
   - Email verification
   - Password reset functionality
   - Google OAuth integration
   - User profile management

2. **Stock Data Management**
   - Real-time stock price updates
   - Historical stock data
   - Company information
   - Market indices (NIFTY 50, SENSEX)
   - Stock search and filtering

3. **Trading Features**
   - Place buy/sell orders
   - Order history tracking
   - Holdings management
   - Positions tracking
   - Order confirmation and notifications

4. **Portfolio Management**
   - Portfolio overview
   - Investment tracking
   - Returns calculation
   - Performance analytics
   - Portfolio allocation visualization

5. **Watchlist Management**
   - Add/remove stocks from watchlist
   - Real-time price updates
   - Price change indicators
   - Stock detail navigation

### Non-Functional Requirements

1. **Performance**
   - Fast page load times (< 3 seconds)
   - Real-time data updates (< 1 second latency)
   - Optimized database queries
   - Efficient state management

2. **Security**
   - Secure authentication (JWT)
   - Password encryption (bcrypt)
   - CORS configuration
   - Input validation and sanitization
   - Session management

3. **Scalability**
   - Modular architecture
   - Database optimization
   - Efficient API design
   - Caching strategies

4. **Usability**
   - Responsive design (mobile, tablet, desktop)
   - Intuitive navigation
   - Clear visual feedback
   - Accessibility features
   - Error handling and user feedback

5. **Reliability**
   - Error handling and logging
   - Data validation
   - Transaction management
   - Backup and recovery

## 🎓 First Principles

### Breaking Problems into Basic Truths & Rebuilding Solutions

This project is built on the foundation of **First Principles Thinking** - breaking down complex problems into fundamental truths and building solutions from the ground up.

### Core Principles Applied

#### 1. **User-Centric Design**
- **Truth**: Users need clear, actionable information to make trading decisions
- **Solution**: Clean, intuitive interface with real-time data and comprehensive analytics
- **Implementation**: Responsive design, clear visual hierarchy, and accessible information

#### 2. **Data Integrity**
- **Truth**: Accurate and timely data is essential for trading decisions
- **Solution**: Real-time WebSocket connections, reliable data sources, and proper error handling
- **Implementation**: Yahoo Finance API integration, WebSocket server, and data validation

#### 3. **Security First**
- **Truth**: Financial applications require robust security measures
- **Solution**: Multi-layer security with JWT, bcrypt, and secure session management
- **Implementation**: Encrypted passwords, token-based authentication, and secure API endpoints

#### 4. **Performance Optimization**
- **Truth**: Fast, responsive applications improve user experience
- **Solution**: Optimized rendering, efficient data fetching, and proper state management
- **Implementation**: React optimization, lazy loading, and efficient database queries

#### 5. **Scalability**
- **Truth**: Applications must grow with user base and features
- **Solution**: Modular architecture, scalable database design, and efficient API structure
- **Implementation**: Component-based architecture, RESTful APIs, and MongoDB for scalability

#### 6. **Maintainability**
- **Truth**: Code must be understandable and modifiable
- **Solution**: Clear code structure, comprehensive documentation, and consistent patterns
- **Implementation**: Modular components, clear naming conventions, and detailed comments

### Problem-Solving Approach

1. **Identify the Core Problem**: What is the fundamental need?
2. **Break Down to Truths**: What are the basic facts and constraints?
3. **Question Assumptions**: Challenge existing solutions and assumptions
4. **Build from Ground Up**: Create solutions based on fundamental truths
5. **Iterate and Improve**: Continuously refine based on feedback

## 🔧 Getting Started

### Development Mode

1. Start all three services:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev

   # Terminal 3 - Dashboard
   cd dashboard && npm run dev
   ```

2. Access the applications:
   - Landing Page: http://localhost:5173
   - Dashboard: http://localhost:5174
   - Backend API: http://localhost:3000

### Production Build

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Build Dashboard**
   ```bash
   cd dashboard
   npm run build
   ```

3. **Start Backend**
   ```bash
   cd backend
   npm start
   ```

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
MONGO_URL=mongodb://localhost:27017/stocktrading
# OR for MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# CORS Configuration
FRONTEND_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# WebSocket Configuration
WS_URL=http://localhost:3000
```

## 📡 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify-email/:token` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password/:token` - Reset password

### Stock Endpoints

- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/:symbol` - Get stock by symbol
- `GET /api/stocks/company-info` - Get company information
- `GET /api/stocks/search/:query` - Search stocks

### Portfolio Endpoints

- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/holdings` - Get user holdings
- `GET /api/positions` - Get user positions
- `GET /api/portfolio` - Get portfolio summary

### WebSocket Events

- `connect` - Client connection
- `disconnect` - Client disconnection
- `initialStockData` - Initial stock data
- `stockUpdate` - Real-time stock price update
- `bulkStockUpdate` - Bulk stock updates

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines

- Use consistent formatting (Prettier recommended)
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Ensure responsive design
- Test on multiple devices

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 📞 Contact

### Get in Touch

We'd love to hear from you! Reach out through any of these channels:

- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)
- **X (Twitter)**: [@YourTwitterHandle](https://twitter.com/yourhandle)
- **Email**: [your.email@example.com](mailto:your.email@example.com)

### Support

For support, feature requests, or bug reports:
- Open an issue on GitHub
- Email us at [support@example.com](mailto:support@example.com)
- Check our documentation

### Connect

- Follow us on social media for updates
- Star this repository if you find it useful
- Share with others who might benefit

---

**Built with ❤️ for Indian Traders**

*Empowering every Indian investor to make informed trading decisions.*

