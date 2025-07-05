const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { UserModel } = require("./model/UserModel");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/test");

// Function to check if a string is base64 encoded
const isBase64 = (str) => {
  try {
    return Buffer.from(str, 'base64').toString('base64') === str;
  } catch (err) {
    return false;
  }
};

// Function to hash password with bcrypt
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Migration function
const migratePasswords = async () => {
  try {
    console.log("Starting password migration...");
    
    // Find all users
    const users = await UserModel.find({});
    console.log(`Found ${users.length} users to check`);
    
    let migratedCount = 0;
    
    for (const user of users) {
      // Check if password is base64 encoded (old format)
      if (isBase64(user.password)) {
        try {
          // Decode the base64 password to get the original password
          const originalPassword = Buffer.from(user.password, 'base64').toString();
          
          // Hash the original password with bcrypt
          const hashedPassword = await hashPassword(originalPassword);
          
          // Update the user's password
          await UserModel.findByIdAndUpdate(user._id, {
            password: hashedPassword
          });
          
          console.log(`✅ Migrated password for user: ${user.email}`);
          migratedCount++;
        } catch (error) {
          console.error(`❌ Failed to migrate password for user: ${user.email}`, error);
        }
      } else {
        console.log(`⏭️  Password already migrated for user: ${user.email}`);
      }
    }
    
    console.log(`Migration completed! ${migratedCount} passwords migrated.`);
    
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run migration
migratePasswords(); 