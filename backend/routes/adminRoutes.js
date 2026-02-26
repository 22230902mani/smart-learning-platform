const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    getActivityLogs,
    getSystemStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLogger');

// All routes require authentication
router.use(protect);

// Routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', logActivity('user_update', 'User'), updateUser);
router.delete('/users/:id', logActivity('user_delete', 'User'), deleteUser);
router.get('/activity-logs', getActivityLogs);
router.get('/stats', getSystemStats);

module.exports = router;
