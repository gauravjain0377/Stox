const { Schema } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return this.provider === 'local'; } },
  provider: { type: String, default: 'local' },
  googleId: { type: String },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = { UserSchema }; 