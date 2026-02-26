const Question = require('../models/Question');
const Topic = require('../models/Topic');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Private (Admin)
exports.getAllQuestions = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            difficulty,
            topic,
            status,
            search,
            sortBy = '-createdAt'
        } = req.query;

        const query = {};

        // Filters
        if (difficulty) query.difficulty = difficulty;
        if (topic) query.topicId = topic;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { questionText: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const questions = await Question.find(query)
            .populate('topicId')
            .sort(sortBy)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Question.countDocuments(query);

        res.status(200).json({
            success: true,
            data: questions,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private (Admin)
exports.getQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id).populate('topicId');

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.status(200).json({
            success: true,
            data: question
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create question
// @route   POST /api/questions
// @access  Private (Admin)
exports.createQuestion = async (req, res, next) => {
    try {
        const questionData = {
            ...req.body,
            createdBy: req.user._id
        };

        // Validate topic exists
        const topic = await Topic.findById(questionData.topicId);
        if (!topic) {
            return res.status(404).json({
                success: false,
                message: 'Topic not found'
            });
        }

        const question = await Question.create(questionData);

        res.status(201).json({
            success: true,
            message: 'Question created successfully',
            data: question
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private (Admin)
exports.updateQuestion = async (req, res, next) => {
    try {
        let question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // If topicId is being updated, validate it exists
        if (req.body.topicId && req.body.topicId !== question.topicId.toString()) {
            const topic = await Topic.findById(req.body.topicId);
            if (!topic) {
                return res.status(404).json({
                    success: false,
                    message: 'Topic not found'
                });
            }
        }

        question = await Question.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Question updated successfully',
            data: question
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private (Admin)
exports.deleteQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        await question.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Question deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Bulk create questions
// @route   POST /api/questions/bulk
// @access  Private (Admin)
exports.bulkCreateQuestions = async (req, res, next) => {
    try {
        const { questions } = req.body;

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of questions'
            });
        }

        const questionsData = questions.map(q => ({
            ...q,
            createdBy: req.user._id
        }));

        const createdQuestions = await Question.insertMany(questionsData);

        res.status(201).json({
            success: true,
            message: `${createdQuestions.length} questions created successfully`,
            data: createdQuestions
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get question statistics
// @route   GET /api/questions/:id/stats
// @access  Private (Admin)
exports.getQuestionStats = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        const accuracy = question.statistics.totalAttempts > 0
            ? (question.statistics.correctAttempts / question.statistics.totalAttempts) * 100
            : 0;

        res.status(200).json({
            success: true,
            data: {
                questionId: question._id,
                totalAttempts: question.statistics.totalAttempts,
                correctAttempts: question.statistics.correctAttempts,
                incorrectAttempts: question.statistics.totalAttempts - question.statistics.correctAttempts,
                accuracy: accuracy.toFixed(2),
                averageTime: question.statistics.averageTime.toFixed(2)
            }
        });
    } catch (error) {
        next(error);
    }
};
