const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getProfile,
  updateProfile,
  uploadProfilePic,
  addOrUpdateAddress
} = require('../controllers/userController');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile-pic', protect, upload.single('image'), uploadProfilePic);
router.put('/address', protect, addOrUpdateAddress);

module.exports = router;
