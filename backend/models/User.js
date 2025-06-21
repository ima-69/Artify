const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  isDefault: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Not required for Google OAuth
    googleId: { type: String },
    profilePic: { type: String, default: '' },
    addresses: [addressSchema],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    isBanned: { type: Boolean, default: false },
    role: { type: String, default: 'user', enum: ['user', 'admin'] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
