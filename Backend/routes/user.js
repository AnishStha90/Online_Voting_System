const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const userController = require('../controllers/userController');
const { upload } = require('../middleware/upload');  // <-- destructuring import

// Public routes
router.post('/register', upload.single('image'), userController.register);
router.get('/verify/:token', userController.verifyEmail);

router.post('/login', userController.login);
router.post('/verify-login-otp', userController.verifyLoginOTP);

// Authenticated user routes
router.get('/profile', isAuthenticated, userController.getProfile);
router.put('/profile', isAuthenticated, userController.updateProfile);

// Admin-only routes
router.get('/', isAuthenticated, isAdmin, userController.getAllUsers);
router.delete('/:id', isAuthenticated, isAdmin, userController.deleteUser);

module.exports = router;
