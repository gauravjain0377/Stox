const mongoose = require("mongoose");
const { UserModel } = require("./model/UserModel");

const testUserModel = async () => {
  try {
    console.log("🧪 Testing UserModel and database connection...");
    
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/test");
    console.log("✅ Connected to MongoDB");
    
    // Test creating a user
    const testUser = new UserModel({
      username: "testuser",
      email: "test@example.com",
      password: "testpassword"
    });
    
    console.log("💾 Attempting to save test user...");
    await testUser.save();
    console.log("✅ Test user saved successfully");
    
    // Test finding user by email
    const foundUser = await UserModel.findOne({ email: "test@example.com" });
    console.log("🔍 Found user by email:", foundUser ? "YES" : "NO");
    
    // Test finding user by username
    const foundByUsername = await UserModel.findOne({ username: "testuser" });
    console.log("🔍 Found user by username:", foundByUsername ? "YES" : "NO");
    
    // Test creating another user with same username
    const testUser2 = new UserModel({
      username: "testuser", // Same username
      email: "test2@example.com", // Different email
      password: "testpassword2"
    });
    
    console.log("💾 Attempting to save second user with same username...");
    await testUser2.save();
    console.log("✅ Second user saved successfully");
    
    // List all users
    const allUsers = await UserModel.find({});
    console.log("📋 All users in database:", allUsers.length);
    allUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.email})`);
    });
    
    // Clean up - remove test users
    await UserModel.deleteMany({ email: { $in: ["test@example.com", "test2@example.com"] } });
    console.log("🧹 Cleaned up test users");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      keyPattern: error.keyPattern
    });
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

// Run the test
testUserModel(); 