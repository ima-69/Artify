const express = require('express');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const { body } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('firstName').notEmpty().withMessage('First name required'),
    body('lastName').notEmpty().withMessage('Last name required'),
    body('phone').notEmpty().isMobilePhone().withMessage('Phone required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
  ],
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail(),
    body('password').exists()
  ],
  login
);

router.post('/forgot-password', [body('email').isEmail()], forgotPassword);
router.post('/reset-password', [
  body('token').exists(),
  body('password').isLength({ min: 8 }),
], resetPassword);

// Google OAuth only if env vars are set
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get(
    '/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login',
      session: false
    }),
    (req, res) => {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
    }
  );
}

module.exports = router;
