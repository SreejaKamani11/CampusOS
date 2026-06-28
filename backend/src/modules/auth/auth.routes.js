const express = require('express');
const authController = require('./auth.controller');
const {
  validateRegister,
  validateLogin,
  validateLogout,
  validateRefreshToken,
} = require('./auth.validation');
const authenticate = require('../../middleware/auth');

const router = express.Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', validateRefreshToken, authController.refreshToken);
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, validateLogout, authController.logout);

module.exports = router;
