const express = require('express');
const router = express.Router();
const {
    getAllQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    bulkCreateQuestions,
    getQuestionStats
} = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLogger');
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');

// Validation rules
const questionValidation = [
    body('topicId').notEmpty().withMessage('Topic ID is required'),
    body('questionText').trim().notEmpty().withMessage('Question text is required'),
    body('correctAnswer').notEmpty().withMessage('Correct answer is required'),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard', 'expert']).withMessage('Invalid difficulty level')
];

// Routes
router.get('/', protect, getAllQuestions);
router.get('/:id', protect, getQuestion);
router.post('/', protect, questionValidation, validate, logActivity('question_create', 'Question'), createQuestion);
router.put('/:id', protect, logActivity('question_update', 'Question'), updateQuestion);
router.delete('/:id', protect, logActivity('question_delete', 'Question'), deleteQuestion);
router.post('/bulk', protect, bulkCreateQuestions);
router.get('/:id/stats', protect, getQuestionStats);

module.exports = router;
