const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @route GET /api/users/profile
exports.getProfile = async (req, res, next) => {
  res.json(req.user);
};

// @route PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 12);
    }
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/users/profile-pic
exports.uploadProfilePic = async (req, res, next) => {
  try {
    if (!req.file || !req.file.path)
      return res.status(400).json({ message: 'No file uploaded' });
    req.user.profilePic = req.file.path;
    await req.user.save();
    res.json({ profilePic: req.user.profilePic });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/users/address
exports.addOrUpdateAddress = async (req, res, next) => {
  try {
    const { address } = req.body; // Should contain all address fields
    if (!address) return res.status(400).json({ message: 'Address required' });

    // Remove isDefault from all if new default
    if (address.isDefault) {
      req.user.addresses.forEach(a => (a.isDefault = false));
    }
    // Push or update address (simplified)
    req.user.addresses.push(address);
    await req.user.save();
    res.json(req.user.addresses);
  } catch (err) {
    next(err);
  }
};
