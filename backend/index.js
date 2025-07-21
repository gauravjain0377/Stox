console.log = function () {};
console.info =function(){};

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const fetch = require('node-fetch');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const stockRoutes = require('./routes/stockRoutes');

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL || "mongodb://localhost:27017/test";

const app = express();

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
    } else if (!user.googleId) {
      // If user exists but not linked to Google, update provider info
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
    // Create a simple token (or use session ID)
    const token = Buffer.from(`${req.user._id}-${Date.now()}`).toString('base64');
    // Pass user info and token as URL params
    const params = new URLSearchParams({
      token,
      user: JSON.stringify({
        id: req.user._id,
        name: req.user.username,
        email: req.user.email,
      }),
      isLoggedIn: 'true'
    });
    res.redirect(`http://localhost:5174/?${params.toString()}`);
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
      password: hashedPassword
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

app.listen(PORT, () => {
  console.log("App started!");
  console.log("DB started!");
});