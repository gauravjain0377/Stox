const { Schema } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return this.provider === 'local'; } },
  provider: { type: String, default: 'local' },
  googleId: { type: String },
  avatar: { type: String },
  // Optional profile fields
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other', ''] , default: ''},
  phone: { type: String },
  clientCode: { type: String, unique: true, index: true },
  pan: { type: String },
  maritalStatus: { type: String },
  fatherName: { type: String },
  demat: { type: String },
  incomeRange: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = { UserSchema }; 