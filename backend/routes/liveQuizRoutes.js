const express = require('express');
const router = express.Router();
const {
    createLiveQuiz,
    generateQuestions,
    getLiveQuizByJoinId,
    getLiveQuizDetails,
    getCreatorHistory,
    getStudentHistory
} = require('../controllers/liveQuizController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes are protected

router.post('/create', createLiveQuiz);
router.post('/generate', generateQuestions);
router.get('/join/:joinId', getLiveQuizByJoinId);
router.get('/creator/history', getCreatorHistory);
router.get('/student/history', getStudentHistory);
router.get('/:id', getLiveQuizDetails);

module.exports = router;
