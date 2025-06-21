const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, 
    googleId: { type: String },
    profilePic: { type: String, default: '' },
    addresses: [addressSchema],
    isBanned: { type: Boolean, default: false },
    role: { type: String, default: 'user', enum: ['user', 'admin'] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
