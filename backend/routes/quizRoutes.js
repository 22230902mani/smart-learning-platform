const express = require('express');
const router = express.Router();
const {
    startQuiz,
    submitAnswer,
    getQuizResults
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLogger');
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');

// Validation rules
const startQuizValidation = [
    body('mode').isIn(['practice', 'timed', 'revision']).withMessage('Invalid quiz mode'),
    body('questionCount').optional().isInt({ min: 1, max: 50 }).withMessage('Question count must be between 1 and 50')
];

const submitAnswerValidation = [
    body('sessionId').notEmpty().withMessage('Session ID is required'),
    body('questionId').notEmpty().withMessage('Question ID is required'),
    body('selectedAnswer').notEmpty().withMessage('Selected answer is required'),
    body('responseTime').isNumeric().withMessage('Response time must be a number')
];

// Routes
router.post('/start', protect, startQuizValidation, validate, logActivity('quiz_start'), startQuiz);
router.post('/submit', protect, submitAnswerValidation, validate, submitAnswer);
router.get('/results/:sessionId', protect, logActivity('quiz_complete'), getQuizResults);

module.exports = router;
