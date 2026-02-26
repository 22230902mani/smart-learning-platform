const express = require('express');
const router = express.Router();
const {
    getAllTopics,
    getTopic,
    createTopic,
    updateTopic,
    deleteTopic,
    getSubjects
} = require('../controllers/topicController');
const { protect, authorize } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLogger');
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');

// Validation rules
const topicValidation = [
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('topic').trim().notEmpty().withMessage('Topic is required'),
    body('subtopic').trim().notEmpty().withMessage('Subtopic is required'),
    body('concept').trim().notEmpty().withMessage('Concept is required')
];

// Routes
router.get('/subjects', protect, getSubjects);
router.get('/', protect, getAllTopics);
router.get('/:id', protect, getTopic);
router.post('/', protect, topicValidation, validate, logActivity('topic_create', 'Topic'), createTopic);
router.put('/:id', protect, logActivity('topic_update', 'Topic'), updateTopic);
router.delete('/:id', protect, logActivity('topic_delete', 'Topic'), deleteTopic);

module.exports = router;
