const mongoose = require("mongoose");

const fixUsernameConstraint = async () => {
  try {
    console.log("🔧 Fixing username unique constraint...");
    
    // Connect to MongoDB and wait for connection (using 'test' database)
    await mongoose.connect("mongodb://localhost:27017/test");
    console.log("✅ Connected to MongoDB (test database)");
    
    // Wait a moment to ensure connection is fully established
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get the database connection
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection not established");
    }
    
    // Drop the unique index on username field
    try {
      await db.collection('users').dropIndex('username_1');
      console.log("✅ Successfully dropped username unique index");
    } catch (error) {
      if (error.code === 26) {
        console.log("ℹ️  Username unique index doesn't exist, skipping...");
      } else {
        console.error("❌ Error dropping username index:", error.message);
      }
    }
    
    // Also try dropping any other username-related indexes
    try {
      await db.collection('users').dropIndex('username_1_1');
      console.log("✅ Successfully dropped additional username index");
    } catch (error) {
      if (error.code === 26) {
        console.log("ℹ️  Additional username index doesn't exist, skipping...");
      } else {
        console.error("❌ Error dropping additional username index:", error.message);
      }
    }
    
    // List all indexes to verify
    const indexes = await db.collection('users').indexes();
    console.log("📋 Current indexes on users collection:");
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log("✅ Username constraint fix completed!");
    
  } catch (error) {
    console.error("❌ Error fixing username constraint:", error);
    console.error("Stack trace:", error.stack);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("🔌 Database connection closed");
    }
  }
};

// Run the fix
fixUsernameConstraint(); 