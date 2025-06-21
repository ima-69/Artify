const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res, next) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { firstName, lastName, email, phone, password } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = await bcrypt.hash(password, 12);

    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.uploadProfilePic = async (req, res, next) => {
  try {
    if (!req.file || !req.file.path) return res.status(400).json({ message: 'No file uploaded' });
    req.user.profilePic = req.file.path;
    await req.user.save();
    res.json({ profilePic: req.user.profilePic });
  } catch (err) {
    next(err);
  }
};

exports.addOrUpdateAddress = async (req, res, next) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ message: 'Address required' });

    // Remove isDefault from all if new default
    if (address.isDefault) req.user.addresses.forEach(a => (a.isDefault = false));
    // Update or add address
    const idx = req.user.addresses.findIndex(
      a =>
        a.street === address.street &&
        a.city === address.city &&
        a.postalCode === address.postalCode
    );
    if (idx > -1) req.user.addresses[idx] = address;
    else req.user.addresses.push(address);

    await req.user.save();
    res.json(req.user.addresses);
  } catch (err) {
    next(err);
  }
};
