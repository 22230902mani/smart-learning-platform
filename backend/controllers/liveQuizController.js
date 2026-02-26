const LiveQuiz = require('../models/LiveQuiz');
const User = require('../models/User');
const Question = require('../models/Question');
const Topic = require('../models/Topic');
const { v4: uuidv4 } = require('uuid');
const { getQuestionsFromBank, hasSubjectInBank } = require('../services/questionBank');
const { fetchQuestionsFromOpenTDB } = require('../services/opentdbService');

// @desc    Generate questions for live quiz
// @route   POST /api/live-quiz/generate
// @access  Private (Teacher/Admin)
exports.generateQuestions = async (req, res) => {
    try {
        const { subject, topicId, count = 10 } = req.body;

        let questions = [];

        // 1. Try Programming Bank
        if (hasSubjectInBank(subject)) {
            questions = getQuestionsFromBank(count, subject);
        }

        // 2. Try DB if not enough
        if (questions.length < count) {
            const dbCount = count - questions.length;
            let query = { status: 'active' };
            if (topicId) query.topicId = topicId;
            else if (subject) {
                const topics = await Topic.find({ subject });
                if (topics.length > 0) query.topicId = { $in: topics.map(t => t._id) };
            }

            const dbQuestions = await Question.find(query).limit(dbCount);
            questions = [...questions, ...dbQuestions];
        }

        // 3. Try External API if still not enough
        if (questions.length < count) {
            const shortfall = count - questions.length;
            try {
                // OpenTDB fetch
                const extQuestions = await fetchQuestionsFromOpenTDB(shortfall, subject);
                questions = [...questions, ...extQuestions];
            } catch (err) {
                console.error('External API failed:', err.message);
            }
        }

        // Format for frontend (must include correct answers for the creator to save them)
        const formatted = questions.map(q => {
            // Handle different question formats (Bank vs DB vs Ext)
            const options = Array.isArray(q.options)
                ? q.options.map(o => typeof o === 'string' ? o : o.text)
                : [];

            let correctIndex = 0;
            if (typeof q.correctAnswer === 'number') {
                correctIndex = q.correctAnswer;
            } else {
                correctIndex = options.indexOf(q.correctAnswer);
                if (correctIndex === -1) correctIndex = 0;
            }

            return {
                questionText: q.questionText,
                options: options,
                correctAnswer: correctIndex
            };
        });

        res.status(200).json({
            success: true,
            data: formatted.slice(0, count)
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create a new live quiz
// @route   POST /api/live-quiz/create
// @access  Private (Teacher/Admin)
exports.createLiveQuiz = async (req, res) => {
    try {
        const { title, subject, timeLimit, questions } = req.body;

        // Generate a 6-digit Join ID (e.g., QZ4821)
        const joinId = 'QZ' + Math.floor(1000 + Math.random() * 9000);

        const liveQuiz = await LiveQuiz.create({
            title,
            subject,
            timeLimit,
            questions,
            joinId,
            creator: req.user._id
        });

        res.status(201).json({
            success: true,
            data: liveQuiz
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get quiz info by Join ID
// @route   GET /api/live-quiz/join/:joinId
// @access  Private
exports.getLiveQuizByJoinId = async (req, res) => {
    try {
        const quiz = await LiveQuiz.findOne({ joinId: req.params.joinId })
            .populate('creator', 'name')
            .select('-questions.correctAnswer'); // Don't send correct answers yet

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Invalid Join ID'
            });
        }

        if (quiz.status === 'finished') {
            return res.status(400).json({
                success: false,
                message: 'This quiz has already ended'
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get live quiz details (including correct answers for creator)
// @route   GET /api/live-quiz/:id
// @access  Private
exports.getLiveQuizDetails = async (req, res) => {
    try {
        const quiz = await LiveQuiz.findById(req.params.id)
            .populate('creator', 'name')
            .populate('participants.user', 'name email');

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get quiz history for teacher
// @route   GET /api/live-quiz/creator/history
// @access  Private (Teacher)
exports.getCreatorHistory = async (req, res) => {
    try {
        const quizzes = await LiveQuiz.find({ creator: req.user._id }).sort('-createdAt');

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get quiz history for student
// @route   GET /api/live-quiz/student/history
// @access  Private
exports.getStudentHistory = async (req, res) => {
    try {
        const quizzes = await LiveQuiz.find({
            'participants.user': req.user._id
        }).sort('-createdAt');

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
