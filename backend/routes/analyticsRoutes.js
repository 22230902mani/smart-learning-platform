const express = require('express');
const router = express.Router();
const {
    getStudentAnalytics,
    getWeakTopics,
    getReadinessScore,
    getAdminAnalytics,
    getAttemptHistory,
    getQuizHistory
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

// Routes
router.get('/student/:userId?', protect, getStudentAnalytics);
router.get('/weak-topics/:userId?', protect, getWeakTopics);
router.get('/readiness/:userId?', protect, getReadinessScore);
router.get('/attempts/:userId?', protect, getAttemptHistory);
router.get('/history/:userId?', protect, getQuizHistory);
router.get('/admin', protect, getAdminAnalytics);

module.exports = router;
