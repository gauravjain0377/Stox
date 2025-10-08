

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const yahooFinance = require('yahoo-finance2').default;
const nodemailer = require('nodemailer');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Suppress Yahoo Finance API notices
yahooFinance.suppressNotices(['yahooSurvey']);

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const stockRoutes = require('./routes/stockRoutes');

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL || "mongodb://localhost:27017/test";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// Helper to generate unique client codes (9-10 digits)
async function generateUniqueClientCode() {
  let code;
  let exists = true;
  while (exists) {
    code = String(Math.floor(100000000 + Math.random() * 900000000)); // 9 digits
    // Ensure uniqueness
    // eslint-disable-next-line no-await-in-loop
    exists = await UserModel.exists({ clientCode: code });
  }
  return code;
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await UserModel.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new UserModel({
        username: profile.displayName,
        email: profile.emails[0].value,
        provider: 'google',
        googleId: profile.id,
        avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
      });
      await user.save();
    } 
    else if (!user.googleId) {
      user.provider = 'google';
      user.googleId = profile.id;
      user.avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : user.avatar;
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Google Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: true }),
  (req, res) => {
    (async () => {
      // Ensure clientCode exists for Google users as well
      if (!req.user.clientCode) {
        req.user.clientCode = await generateUniqueClientCode();
        await req.user.save();
      }
      // Create a simple token (or use session ID)
      const token = Buffer.from(`${req.user._id}-${Date.now()}`).toString('base64');
      // Pass user info and token as URL params
      const params = new URLSearchParams({
        token,
        user: JSON.stringify({
          id: req.user._id,
          name: req.user.username,
          email: req.user.email,
          clientCode: req.user.clientCode,
        }),
        isLoggedIn: 'true'
      });
      res.redirect(`http://localhost:5174/?${params.toString()}`);
    })();
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173'); // Redirect to main landing home page
  });
});

app.get('/auth/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

// Middleware to handle authentication (both session and token)
const authenticateUser = async (req, res, next) => {
  try {
    // First check if user is authenticated via session (Passport.js)
    if (req.isAuthenticated()) {
      return next();
    }
    
    // If not authenticated via session, check for token in headers or user data in request
    const authHeader = req.headers.authorization;
    const userDataHeader = req.headers['x-user-data'];
    
    if (userDataHeader) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataHeader));
        if (userData.id) {
          // Find user in database to verify
          const user = await UserModel.findById(userData.id);
          if (user) {
            req.user = user;
            return next();
          }
        }
      } catch (error) {
        console.error('Error parsing user data header:', error);
      }
    }
    
    // If token is provided, try to validate it
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      try {
        // Decode the simple token (userId-timestamp format)
        const decoded = Buffer.from(token, 'base64').toString();
        const [userId] = decoded.split('-');
        
        const user = await UserModel.findById(userId);
        if (user) {
          req.user = user;
          return next();
        }
      } catch (error) {
        console.error('Error validating token:', error);
      }
    }
    
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

// Test authentication endpoint
app.get('/api/auth/test', authenticateUser, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Authentication successful', 
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });
});

// API endpoint to buy a stock
app.post('/api/orders/buy', authenticateUser, async (req, res) => {
  try {
    
    const { symbol, name, quantity, price } = req.body;
    
    if (!symbol || !name || !quantity || !price) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Create a new order
    const newOrder = new OrdersModel({
      userId: req.user._id,
      name: name,
      qty: quantity,
      price: price,
      mode: 'buy',
      timestamp: new Date()
    });
    
    await newOrder.save();
    
    // Check if user already has holdings for this stock
    let holding = await HoldingsModel.findOne({ 
      userId: req.user._id,
      name: name
    });
    
    if (holding) {
      // Update existing holding
      const totalShares = holding.qty + quantity;
      const totalCost = (holding.qty * holding.avg) + (quantity * price);
      const newAvgPrice = totalCost / totalShares;
      
      holding.qty = totalShares;
      holding.avg = newAvgPrice;
      holding.price = price; // Current price
      await holding.save();
    } else {
      // Create new holding
      const newHolding = new HoldingsModel({
        userId: req.user._id,
        name: name,
        qty: quantity,
        avg: price,
        price: price,
        net: '0%',
        day: '0%'
      });
      
      await newHolding.save();
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully',
      order: newOrder
    });
    
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

// API endpoint to sell a stock
app.post('/api/orders/sell', authenticateUser, async (req, res) => {
  try {
    
    const { symbol, name, quantity, price } = req.body;
    
    if (!symbol || !name || !quantity || !price) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Check if user has enough holdings to sell
    const holding = await HoldingsModel.findOne({ 
      userId: req.user._id,
      name: name
    });
    
    if (!holding || holding.qty < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Not enough shares to sell' 
      });
    }
    
    // Create a new sell order
    const newOrder = new OrdersModel({
      userId: req.user._id,
      name: name,
      qty: quantity,
      price: price,
      mode: 'sell',
      timestamp: new Date()
    });
    
    await newOrder.save();
    
    // Update holdings
    const remainingShares = holding.qty - quantity;
    
    if (remainingShares > 0) {
      // Update existing holding if shares remain
      holding.qty = remainingShares;
      holding.price = price; // Update current price
      await holding.save();
    } else {
      // Remove holding if all shares are sold
      await HoldingsModel.deleteOne({ _id: holding._id });
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Sell order placed successfully',
      order: newOrder
    });
    
  } catch (error) {
    console.error('Error placing sell order:', error);
    res.status(500).json({ success: false, message: 'Failed to place sell order' });
  }
});

// API endpoint to get all orders for a user
app.get('/api/orders', authenticateUser, async (req, res) => {
  try {
    const orders = await OrdersModel.find({ userId: req.user._id })
      .sort({ timestamp: -1 });
    
    res.json({ success: true, orders });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// API endpoint to get a specific order by ID
app.get('/api/orders/:orderId', authenticateUser, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await OrdersModel.findOne({ 
      _id: orderId,
      userId: req.user._id 
    });
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    
    // Create enhanced order object with additional fields for display
    const enhancedOrder = {
      ...order.toObject(),
      type: 'Delivery',
      subtype: 'Regular', 
      market: 'NSE',
      exchange: 'NSE',
      duration: 'Day',
      avgPrice: order.price, // For now, avg price same as order price
      mktPrice: order.price, // Current market price (could be fetched from live API)
      status: 'Executed', // All orders are executed in our system
      statusSteps: [
        {
          label: 'Request Verified',
          time: new Date(order.timestamp).toLocaleString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            day: '2-digit',
            month: 'short'
          }),
          completed: true
        },
        {
          label: 'Order Placed with NSE',
          time: new Date(order.timestamp).toLocaleString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            day: '2-digit',
            month: 'short'
          }),
          completed: true
        },
        {
          label: 'Order Executed',
          time: new Date(order.timestamp).toLocaleString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            day: '2-digit',
            month: 'short'
          }),
          completed: true
        }
      ],
      trades: [
        {
          time: new Date(order.timestamp).toLocaleString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit'
          }),
          price: order.price,
          qty: order.qty,
          amount: order.price * order.qty
        }
      ],
      orderValue: order.price * order.qty
    };
    
    res.json({ success: true, order: enhancedOrder });
    
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order details' });
  }
});

// API endpoint to get all holdings for a user
app.get('/api/holdings', authenticateUser, async (req, res) => {
  try {
    
    const holdings = await HoldingsModel.find({ userId: req.user._id });
    
    res.json({ success: true, holdings });
    
  } catch (error) {
    console.error('Error fetching holdings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch holdings' });
  }
});

// Update user profile
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = [
      'username','email','dateOfBirth','gender','phone','clientCode','pan','maritalStatus','fatherName','demat','incomeRange','avatar'
    ];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    // If dateOfBirth is a string, try to convert to Date
    if (update.dateOfBirth && typeof update.dateOfBirth === 'string') {
      const d = new Date(update.dateOfBirth);
      if (!isNaN(d)) update.dateOfBirth = d;
    }

    const user = await UserModel.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(404).json({ success:false, message:'User not found' });

    return res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        phone: user.phone,
        clientCode: user.clientCode,
        pan: user.pan,
        maritalStatus: user.maritalStatus,
        fatherName: user.fatherName,
        demat: user.demat,
        incomeRange: user.incomeRange,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('❌ Error updating user profile:', err);
    res.status(500).json({ success:false, message:'Server error' });
  }
});

// Add test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Add database test endpoint
app.get("/api/test-db", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected", 
      2: "connecting",
      3: "disconnecting"
    };
    
    res.json({ 
      message: "Database connection test",
      status: states[dbState] || "unknown",
      readyState: dbState,
      connected: dbState === 1
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Database test failed", 
      details: error.message 
    });
  }
});

// Use .env variable for MongoDB connection
mongoose.connect(uri)
.then(() => {
  console.log("✅ Connected to MongoDB successfully!");
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  console.log("💡 Make sure MongoDB is running on your system");
});

// Secure password hashing with bcrypt
const hashPassword = async (password) => {
  const saltRounds = 12; // Higher number = more secure but slower
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// app.get("/addHoldings", async (req, res) => {
//   let tempHoldings = [
//     {
//       name: "BHARTIARTL",
//       qty: 2,
//       avg: 538.05,
//       price: 541.15,
//       net: "+0.58%",
//       day: "+2.99%",
//     },
//     {
//       name: "HDFCBANK",
//       qty: 2,
//       avg: 1383.4,
//       price: 1522.35,
//       net: "+10.04%",
//       day: "+0.11%",
//     },
//     {
//       name: "HINDUNILVR",
//       qty: 1,
//       avg: 2335.85,
//       price: 2417.4,
//       net: "+3.49%",
//       day: "+0.21%",
//     },
//     {
//       name: "INFY",
//       qty: 1,
//       avg: 1350.5,
//       price: 1555.45,
//       net: "+15.18%",
//       day: "-1.60%",
//       isLoss: true,
//     },
//     {
//       name: "ITC",
//       qty: 5,
//       avg: 202.0,
//       price: 207.9,
//       net: "+2.92%",
//       day: "+0.80%",
//     },
//     {
//       name: "KPITTECH",
//       qty: 5,
//       avg: 250.3,
//       price: 266.45,
//       net: "+6.45%",
//       day: "+3.54%",
//     },
//     {
//       name: "M&M",
//       qty: 2,
//       avg: 809.9,
//       price: 779.8,
//       net: "-3.72%",
//       day: "-0.01%",
//       isLoss: true,
//     },
//     {
//       name: "RELIANCE",
//       qty: 1,
//       avg: 2193.7,
//       price: 2112.4,
//       net: "-3.71%",
//       day: "+1.44%",
//     },
//     {
//       name: "SBIN",
//       qty: 4,
//       avg: 324.35,
//       price: 430.2,
//       net: "+32.63%",
//       day: "-0.34%",
//       isLoss: true,
//     },
//     {
//       name: "SGBMAY29",
//       qty: 2,
//       avg: 4727.0,
//       price: 4719.0,
//       net: "-0.17%",
//       day: "+0.15%",
//     },
//     {
//       name: "TATAPOWER",
//       qty: 5,
//       avg: 104.2,
//       price: 124.15,
//       net: "+19.15%",
//       day: "-0.24%",
//       isLoss: true,
//     },
//     {
//       name: "TCS",
//       qty: 1,
//       avg: 3041.7,
//       price: 3194.8,
//       net: "+5.03%",
//       day: "-0.25%",
//       isLoss: true,
//     },
//     {
//       name: "WIPRO",
//       qty: 4,
//       avg: 489.3,
//       price: 577.75,
//       net: "+18.08%",
//       day: "+0.32%",
//     },
//   ];

//   tempHoldings.forEach((item) => {
//     let newHolding = new HoldingsModel({
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.day,
//       day: item.day,
//     });

//     newHolding.save();
//   });
//   res.send("Done!");
// });

// app.get("/addPositions", async (req, res) => {
//   let tempPositions = [
//     {
//       product: "CNC",
//       name: "EVEREADY",
//       qty: 2,
//       avg: 316.27,
//       price: 312.35,
//       net: "+0.58%",
//       day: "-1.24%",
//       isLoss: true,
//     },
//     {
//       product: "CNC",
//       name: "JUBLFOOD",
//       qty: 1,
//       avg: 3124.75,
//       price: 3082.65,
//       net: "+10.04%",
//       day: "-1.35%",
//       isLoss: true,
//     },
//   ];

//   tempPositions.forEach((item) => {
//     let newPosition = new PositionsModel({
//       product: item.product,
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//       isLoss: item.isLoss,
//     });

//     newPosition.save();
//   });
//   res.send("Done!");
// });

app.get("/allHoldings", async (req, res) => {
  try {
    const { userId } = req.query;
    console.log("📊 Fetching holdings for userId:", userId);
    
    if (!userId || userId === 'undefined' || userId === 'null') {
      console.log("❌ No valid userId provided, returning empty array");
      return res.status(200).json([]);
    }
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.error("❌ MongoDB not connected. ReadyState:", mongoose.connection.readyState);
      return res.status(500).json({ 
        error: "Database connection not available", 
        details: "MongoDB is not connected. Please check if MongoDB is running." 
      });
    }
    
    let allHoldings = await HoldingsModel.find({ userId });
    console.log(`✅ Found ${allHoldings.length} holdings for user ${userId}`);
    res.json(allHoldings);
  } catch (error) {
    console.error("❌ Error fetching holdings:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: "Failed to fetch holdings", 
      details: error.message,
      type: error.name
    });
  }
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

// Authentication endpoints
app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, password, provider } = req.body;
    if (provider === 'google') {
      return res.status(400).json({ success: false, message: "Google signup is not allowed here. Use 'Continue with Google' instead." });
    }
    
    console.log("🔍 Registration attempt:", { name, email, password: password ? "PROVIDED" : "MISSING" });
    
    // Validate input
    if (!name || !email || !password) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ 
        success: false, 
        message: "Name, email, and password are required" 
      });
    }
    
    // Check if user already exists by email only (names can be the same)
    const existingUser = await UserModel.findOne({ email });
    
    if (existingUser) {
      console.log("❌ User with email already exists:", existingUser.email);
      return res.status(400).json({ 
        success: false, 
        message: "User with this email already exists" 
      });
    }
    
    console.log("✅ No existing user found, creating new user...");
    
    // Create new user
    const hashedPassword = await hashPassword(password);
    const newUser = new UserModel({
      username: name,
      email,
      password: hashedPassword,
      clientCode: await generateUniqueClientCode()
    });
    
    console.log("💾 Saving new user to database...");
    await newUser.save();
    console.log("✅ User saved successfully:", { id: newUser._id, username: newUser.username, email: newUser.email });
    
    // Create a simple token (in production, use JWT)
    const token = Buffer.from(`${newUser._id}-${Date.now()}`).toString('base64');
    
    res.json({ 
      success: true, 
      message: "User created successfully",
      token: token,
      user: {
        id: newUser._id,
        name: newUser.username,
        email: newUser.email,
        clientCode: newUser.clientCode,
        role: "user"
      }
    });
  } catch (error) {
    console.error("❌ Error in signup:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      keyPattern: error.keyPattern
    });
    
    // Provide more specific error messages
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      console.log("🔍 Duplicate key error for field:", field);
      return res.status(400).json({ 
        success: false, 
        message: `${field} already exists` 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Error creating user",
      error: error.message 
    });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await UserModel.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    // Verify password
    if (!await verifyPassword(password, user.password)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid password" 
      });
    }
    
    // Ensure clientCode exists
    if (!user.clientCode) {
      user.clientCode = await generateUniqueClientCode();
      await user.save();
    }
    // Create a simple token (in production, use JWT)
    const token = Buffer.from(`${user._id}-${Date.now()}`).toString('base64');
    
    res.json({ 
      success: true, 
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        clientCode: user.clientCode,
        role: "user"
      }
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ success: false, message: "Error during login" });
  }
});

app.get("/allOrders", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    let allOrders = await OrdersModel.find({ userId }).sort({ timestamp: -1 });
    res.json(allOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Check if user exists
app.get("/user/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ 
      success: true, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      } 
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
});

// Add Twelve Data price API endpoint
app.get('/api/price/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not set in .env' });
  }
  try {
    const url = `https://api.twelvedata.com/price?symbol=${symbol}.NSE&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.price) {
      res.json({ price: data.price });
    } else {
      res.status(404).json({ error: data.message || 'Price not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper to fetch live price internally
async function getLivePrice(symbol) {
  try {
    const apiKey = process.env.TWELVE_DATA_API_KEY;
    if (!apiKey) return null;
    const url = `https://api.twelvedata.com/price?symbol=${symbol}.NSE&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.price) {
      return parseFloat(data.price);
    }
    return null;
  } catch (err) {
    return null;
  }
}

// Positions API - derive from holdings for the user with live prices
app.get("/positions", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(200).json([]);
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: "Database connection not available" });
    }

    const userHoldings = await HoldingsModel.find({ userId });
    // Build positions array with live price if possible
    const positions = await Promise.all(userHoldings.map(async (h) => {
      const livePrice = await getLivePrice(h.name) || h.price || h.avg;
      const quantity = h.qty || 0;
      const avgPrice = h.avg || 0;
      const value = livePrice * quantity;
      const pnl = (livePrice - avgPrice) * quantity;
      return {
        product: "CNC",
        name: h.name,
        qty: quantity,
        avg: avgPrice,
        ltp: livePrice,
        value,
        pnl,
        // placeholders for day change if previous close not tracked
        dayChangePct: null,
        isLoss: pnl < 0,
      };
    }));

    res.json(positions);
  } catch (error) {
    console.error("❌ Error fetching positions:", error);
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

// Square-off (close) a position entirely for a user
app.post("/positions/close", async (req, res) => {
  try {
    const { userId, name } = req.body;
    if (!userId || !name) {
      return res.status(400).json({ success: false, message: "userId and name are required" });
    }

    const holding = await HoldingsModel.findOne({ userId, name });
    if (!holding || holding.qty <= 0) {
      return res.status(400).json({ success: false, message: "No open position to square off" });
    }

    const sellQty = holding.qty;
    const livePrice = await getLivePrice(name) || holding.price || holding.avg || 0;

    // Record an order entry for SELL
    const sellOrder = new OrdersModel({
      userId,
      name,
      qty: sellQty,
      price: livePrice,
      mode: "SELL",
      timestamp: new Date()
    });
    await sellOrder.save();

    // Remove or reduce holding to 0
    await HoldingsModel.deleteOne({ _id: holding._id });

    res.json({ success: true, message: "Position squared off", soldQty: sellQty, price: livePrice });
  } catch (error) {
    console.error("❌ Error squaring off position:", error);
    res.status(500).json({ success: false, message: "Failed to square off position" });
  }
});

// Partial close a position
app.post("/positions/partial-close", async (req, res) => {
  try {
    const { userId, name, qty } = req.body;
    const quantity = parseInt(qty, 10);
    if (!userId || !name || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: "userId, name and positive qty are required" });
    }

    const holding = await HoldingsModel.findOne({ userId, name });
    if (!holding || holding.qty <= 0) {
      return res.status(400).json({ success: false, message: "No open position to close" });
    }
    if (quantity > holding.qty) {
      return res.status(400).json({ success: false, message: "Cannot sell more than held quantity" });
    }

    const livePrice = await getLivePrice(name) || holding.price || holding.avg || 0;

    const sellOrder = new OrdersModel({
      userId,
      name,
      qty: quantity,
      price: livePrice,
      mode: "SELL",
      timestamp: new Date()
    });
    await sellOrder.save();

    holding.qty = holding.qty - quantity;
    if (holding.qty <= 0) {
      await HoldingsModel.deleteOne({ _id: holding._id });
    } else {
      holding.price = livePrice;
      await holding.save();
    }

    res.json({ success: true, message: "Partial position closed", soldQty: quantity, price: livePrice });
  } catch (error) {
    console.error("❌ Error partial closing position:", error);
    res.status(500).json({ success: false, message: "Failed to partial close position" });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    const { userId, name, qty, price, mode } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    // For BUY orders, validate price against live market price
    if (mode === "BUY") {
      const apiKey = process.env.TWELVE_DATA_API_KEY;
      const url = `https://api.twelvedata.com/price?symbol=${name}.NSE&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!data.price) {
        return res.status(400).json({ success: false, message: data.message || 'Live price unavailable' });
      }
      const livePrice = parseFloat(data.price);
      if (parseFloat(price) < livePrice) {
        return res.status(400).json({ success: false, message: `Buy price (₹${price}) cannot be below live market price (₹${livePrice})` });
      }
    }
    // Save the order
    let newOrder = new OrdersModel({
      userId: userId,
      name: name,
      qty: qty,
      price: price,
      mode: mode,
    });

    await newOrder.save();

    // If it's a BUY order, update holdings
    if (mode === "BUY") {
      // Check if the stock already exists in holdings for this user
      let existingHolding = await HoldingsModel.findOne({ 
        name: name, 
        userId: userId 
      });
      
      if (existingHolding) {
        // Update existing holding - calculate new average price
        const totalQty = existingHolding.qty + parseInt(qty);
        const totalValue = (existingHolding.avg * existingHolding.qty) + (parseFloat(price) * parseInt(qty));
        const newAvgPrice = totalValue / totalQty;
        
        existingHolding.qty = totalQty;
        existingHolding.avg = newAvgPrice;
        existingHolding.price = parseFloat(price); // Update current price
        await existingHolding.save();
      } else {
        // Create new holding
        let newHolding = new HoldingsModel({
          userId: userId,
          name: name,
          qty: parseInt(qty),
          avg: parseFloat(price),
          price: parseFloat(price),
          net: "+0.00%",
          day: "+0.00%",
        });
        await newHolding.save();
      }
    }
    // If it's a SELL order, update holdings
    else if (mode === "SELL") {
      let existingHolding = await HoldingsModel.findOne({ 
        name: name, 
        userId: userId 
      });
      if (!existingHolding) {
        return res.status(400).json({ success: false, message: "No holdings to sell for this stock." });
      }
      const sellQty = parseInt(qty);
      if (sellQty > existingHolding.qty) {
        return res.status(400).json({ success: false, message: "Cannot sell more than you own." });
      }
      existingHolding.qty -= sellQty;
      existingHolding.price = parseFloat(price); // Update current price
      if (existingHolding.qty === 0) {
        await HoldingsModel.deleteOne({ _id: existingHolding._id });
      } else {
        await existingHolding.save();
      }
    }

    res.json({ success: true, message: "Order saved and holdings updated!" });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ success: false, message: "Error processing order" });
  }
});

// Register stockRoutes before the hardcoded endpoints
app.use('/api/stocks', stockRoutes);

app.post("/api/users/change-password", async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    console.log('🔑 Change password request:', { email, currentPassword: !!currentPassword, newPassword: !!newPassword });
    if (!email || !currentPassword || !newPassword) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await verifyPassword(currentPassword, user.password);
    if (!isMatch) {
      console.log('❌ Current password is incorrect for user:', email);
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    const newHash = await hashPassword(newPassword);
    user.password = newHash;
    await user.save();
    console.log('✅ Password updated for user:', email);

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("❌ Error changing password:", err);
    res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
});

// Support contact endpoint - sends emails from contact form
app.post('/api/support/contact', async (req, res) => {
  try {
    const { name, email, subject, purpose, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }

    const smtpUser = process.env.MAIL_USER;
    const smtpPass = process.env.MAIL_PASS;
    const smtpHost = process.env.MAIL_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.MAIL_PORT || '587', 10);
    const supportTo = process.env.SUPPORT_TO || 'gjain0229@gmail.com';

    if (!smtpUser || !smtpPass) {
      return res.status(500).json({ success: false, message: 'Mailer is not configured on server' });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass }
    });

    const mailSubjectBase = subject && subject.trim() ? subject : `Support: ${purpose || 'General inquiry'}`;
    const mailSubject = `[StockSathi] ${mailSubjectBase}`;
    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#0f172a;background:#f8fafc;padding:20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <thead>
            <tr>
              <th style="text-align:left;background:#0ea5e9;padding:16px 20px;color:#ffffff;font-size:18px;">
                StockSathi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:16px 20px;border-bottom:1px solid #f1f5f9;">
                <div style="color:#0f172a;font-weight:600;font-size:16px;margin-bottom:8px;">New Support Request</div>
                <div style="color:#475569">You received a new message from the Help & Support form.</div>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:100%;font-size:14px;color:#0f172a;">
                  <tr>
                    <td style="width:160px;color:#64748b;padding:6px 0;">Name</td>
                    <td style="padding:6px 0;">${name}</td>
                  </tr>
                  <tr>
                    <td style="width:160px;color:#64748b;padding:6px 0;">Email</td>
                    <td style="padding:6px 0;">${email}</td>
                  </tr>
                  <tr>
                    <td style="width:160px;color:#64748b;padding:6px 0;">Purpose</td>
                    <td style="padding:6px 0;">${purpose || 'General inquiry'}</td>
                  </tr>
                  ${subject && subject.trim() ? `
                  <tr>
                    <td style="width:160px;color:#64748b;padding:6px 0;">Subject</td>
                    <td style="padding:6px 0;">${subject}</td>
                  </tr>` : ''}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 20px;">
                <div style="color:#64748b;margin-bottom:6px;">Message</div>
                <div style="white-space:pre-wrap;line-height:1.6;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px;">${message}</div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td style="padding:12px 20px;color:#94a3b8;font-size:12px;background:#f8fafc;border-top:1px solid #e2e8f0;">
                This email was sent by the StockSathi Support system.
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;

    await transporter.sendMail({
      from: {
        name: 'StockSathi Support',
        address: smtpUser
      },
      to: supportTo,
      replyTo: email,
      subject: mailSubject,
      html
    });

    res.json({ success: true, message: 'Message sent. We will get back to you shortly.' });
  } catch (err) {
    console.error('❌ Support email error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// FAQs endpoint - beginner-friendly FAQs for Help & Support
app.get('/api/support/faqs', async (req, res) => {
  try {
    const faqs = [
      {
        id: 'what-is-a-stock',
        question: 'What is a stock?',
        answer:
          'A stock represents a small ownership share in a company. When you buy a stock, you own a portion of that company and may benefit if the company grows in value.'
      },
      {
        id: 'how-do-stocks-make-money',
        question: 'How can I make money from stocks?',
        answer:
          'You can potentially earn through capital gains (selling at a higher price than you bought) and dividends (periodic payouts companies may distribute to shareholders).'
      },
      {
        id: 'what-is-diversification',
        question: 'What is diversification and why is it important?',
        answer:
          'Diversification means spreading your investments across different companies, sectors, or asset classes. It helps reduce risk because poor performance in one area can be offset by better performance in another.'
      },
      {
        id: 'what-is-volatility',
        question: 'What does market volatility mean?',
        answer:
          'Volatility is how much and how quickly prices move. High volatility means prices can change rapidly in either direction, which can increase both risk and opportunity.'
      },
      {
        id: 'long-term-vs-short-term',
        question: 'Is stock investing better for the long term or short term?',
        answer:
          'While strategies vary, many investors focus on long-term investing to smooth out short-term ups and downs and benefit from compound growth over time.'
      },
      {
        id: 'what-is-stop-loss',
        question: 'What is a stop-loss order?',
        answer:
          'A stop-loss is an order that automatically sells your stock if it falls to a set price. It helps limit potential losses and manage risk.'
      },
      {
        id: 'how-much-to-invest',
        question: 'How much should I invest as a beginner?',
        answer:
          'Start small and only invest money you can afford to leave invested for a while. Focus on learning, building discipline, and diversifying as your knowledge grows.'
      },
      {
        id: 'what-are-fees',
        question: 'Are there any fees when trading stocks?',
        answer:
          'Depending on your broker and market, you may pay brokerage, taxes, and other regulatory charges. Always review the fee breakdown before placing orders.'
      }
    ];

    res.json({ success: true, items: faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load FAQs' });
  }
});

// Real-time stock data management
const stockSymbols = [
  'RELIANCE.NS', 'HDFCBANK.NS', 'ICICIBANK.NS', 'TCS.NS', 'BHARTIARTL.NS',
  'INFY.NS', 'ITC.NS', 'KOTAKBANK.NS', 'LT.NS', 'SBIN.NS', 'AXISBANK.NS',
  'HINDUNILVR.NS', 'BAJFINANCE.NS', 'HCLTECH.NS', 'MARUTI.NS', 'ASIANPAINT.NS',
  'SUNPHARMA.NS', 'TITAN.NS', 'ULTRACEMCO.NS', 'NTPC.NS', 'TATAMOTORS.NS',
  'POWERGRID.NS', 'TATASTEEL.NS', 'JSWSTEEL.NS', 'NESTLEIND.NS', 'HDFCLIFE.NS',
  'TECHM.NS', 'WIPRO.NS', 'BAJAJFINSV.NS', 'GRASIM.NS', 'ADANIGREEN.NS',
  'ADANIPORTS.NS', 'COALINDIA.NS', 'BPCL.NS', 'UPL.NS', 'HINDALCO.NS',
  'EICHERMOT.NS', 'DIVISLAB.NS', 'CIPLA.NS', 'BRITANNIA.NS', 'M&M.NS',
  'BAJAJ_AUTO.NS', 'HERO.NS', 'DRREDDY.NS', 'DABUR.NS', 'APOLLOHOSP.NS',
  'TATACONSUM.NS', 'ONGC.NS', 'INDUSINDBK.NS', 'HDFC.NS'
];

let currentStockData = new Map();
let connectedClients = 0;

// Fetch live stock data
async function fetchLiveStockData() {
  try {
    const results = await Promise.allSettled(
      stockSymbols.map(async (symbol) => {
        try {
          const data = await yahooFinance.quote(symbol);
          const previousClose = data.regularMarketPreviousClose || 0;
          // Only calculate circuits if previousClose exists and is not zero
          const lowerCircuit = previousClose ? Number((previousClose * 0.95).toFixed(2)) : null;
          const upperCircuit = previousClose ? Number((previousClose * 1.05).toFixed(2)) : null;
          
          return {
            symbol: symbol.replace('.NS', ''),
            name: data.shortName,
            price: data.regularMarketPrice,
            change: data.regularMarketChange,
            percentChange: data.regularMarketChangePercent,
            previousClose: previousClose || null,
            lowerCircuit: lowerCircuit,
            upperCircuit: upperCircuit,
            volume: data.regularMarketVolume,
            marketCap: data.marketCap || null,
            lastUpdate: new Date().toISOString()
          };
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error.message);
          return null;
        }
      })
    );

    const validResults = results
      .filter(result => result.status === 'fulfilled' && result.value !== null)
      .map(result => result.value);

    // Update current data and emit changes
    validResults.forEach(stock => {
      const previousData = currentStockData.get(stock.symbol);
      currentStockData.set(stock.symbol, stock);
      
      // Emit individual stock update
      io.emit('stockUpdate', stock);
    });

    // Emit bulk update every 30 seconds
    if (validResults.length > 0) {
      io.emit('bulkStockUpdate', validResults);
      console.log(`Updated ${validResults.length} stocks at ${new Date().toLocaleTimeString()}`);
    }

  } catch (error) {
    console.error('Error in fetchLiveStockData:', error);
  }
}

// WebSocket connection handling
io.on('connection', (socket) => {
  connectedClients++;
  console.log(`Client connected. Total clients: ${connectedClients}`);
  
  // Send current data to newly connected client
  if (currentStockData.size > 0) {
    const allStocks = Array.from(currentStockData.values());
    socket.emit('initialStockData', allStocks);
  }

  socket.on('disconnect', () => {
    connectedClients--;
    console.log(`Client disconnected. Total clients: ${connectedClients}`);
  });

  socket.on('requestStockUpdate', () => {
    if (currentStockData.size > 0) {
      const allStocks = Array.from(currentStockData.values());
      socket.emit('bulkStockUpdate', allStocks);
    }
  });
});

// Start periodic updates every 10 seconds
setInterval(fetchLiveStockData, 10000);

// Initial data fetch
fetchLiveStockData();

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
  console.log("DB started!");
  console.log("WebSocket server ready for real-time stock updates!");
});