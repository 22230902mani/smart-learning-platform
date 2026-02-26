const express = require('express');
const router = express.Router();
const {
    register,
    login,
    refreshToken,
    logout,
    getMe,
    updateProfile,
    changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLogger');
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');

// Validation rules
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

const updateProfileValidation = [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail()
];

const changePasswordValidation = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Routes
router.post('/register', registerValidation, validate, logActivity('register'), register);
router.post('/login', loginValidation, validate, logActivity('login'), login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logActivity('logout'), logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfileValidation, validate, logActivity('profile_update'), updateProfile);
router.put('/change-password', protect, changePasswordValidation, validate, changePassword);

module.exports = router;
