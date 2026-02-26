const Attempt = require('../models/Attempt');
const TopicStats = require('../models/TopicStats');
const MistakeLog = require('../models/MistakeLog');
const Prediction = require('../models/Prediction');
const Question = require('../models/Question');

// @desc    Get student performance analytics
// @route   GET /api/analytics/student/:userId
// @access  Private
exports.getStudentAnalytics = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.user._id;

        // Ensure user can only access their own data or admin can access any
        if (userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this data'
            });
        }

        const mongoose = require('mongoose');

        // Parallel execution of independent queries
        const [overviewStats, topicStats, mistakes, performanceTrend] = await Promise.all([
            // Overall Statistics using aggregation
            Attempt.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: null,
                        totalAttempts: { $sum: 1 },
                        correctAttempts: { $sum: { $cond: ["$isCorrect", 1, 0] } },
                        averageTimePerQuestion: { $avg: "$responseTime" }
                    }
                }
            ]),
            // Topic Statistics
            TopicStats.find({ userId }).populate('topicId').sort({ masteryScore: -1 }),
            // Mistake Logs
            MistakeLog.find({ userId, resolved: false }).populate('questionId topicId'),
            // Performance Trend
            calculatePerformanceTrend(userId)
        ]);

        const stats = overviewStats[0] || { totalAttempts: 0, correctAttempts: 0, averageTimePerQuestion: 0 };
        const totalAttempts = stats.totalAttempts;
        const correctAttempts = stats.correctAttempts;
        const overallAccuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

        // Get weak topics (mastery score < 75)
        let weakTopics = topicStats.filter(t => t.masteryScore < 75);
        if (weakTopics.length === 0 && topicStats.length > 0) {
            weakTopics = [...topicStats].sort((a, b) => a.masteryScore - b.masteryScore).slice(0, 3);
        }

        const strongTopics = topicStats.filter(t => t.masteryScore >= 75);

        // Recent performance (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentStats = await Attempt.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    timestamp: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    correct: { $sum: { $cond: ["$isCorrect", 1, 0] } }
                }
            }
        ]);

        const recentAccuracy = recentStats[0] && recentStats[0].count > 0
            ? (recentStats[0].correct / recentStats[0].count) * 100
            : 0;

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalAttempts,
                    correctAttempts,
                    incorrectAttempts: totalAttempts - correctAttempts,
                    overallAccuracy: overallAccuracy.toFixed(2),
                    recentAccuracy: recentAccuracy.toFixed(2),
                    averageTimePerQuestion: stats.averageTimePerQuestion?.toFixed(2) || 0
                },
                topicStats: {
                    all: topicStats,
                    weak: weakTopics,
                    strong: strongTopics
                },
                mistakes: {
                    unresolved: mistakes,
                    count: mistakes.length
                },
                performanceTrend
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get weak topics analysis
// @route   GET /api/analytics/weak-topics/:userId
// @access  Private
exports.getWeakTopics = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.user._id;

        // Authorization check
        if (userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this data'
            });
        }

        // Get all topic stats
        const topicStats = await TopicStats.find({ userId }).populate('topicId');

        // Identify weak topics (mastery score < 50)
        const weakTopics = topicStats
            .filter(t => t.masteryScore < 50)
            .sort((a, b) => a.masteryScore - b.masteryScore);

        // Get unresolved mistakes for weak topics
        const weakTopicAnalysis = await Promise.all(
            weakTopics.map(async (topic) => {
                const mistakes = await MistakeLog.find({
                    userId,
                    topicId: topic.topicId,
                    resolved: false
                }).populate('questionId');

                return {
                    topic: topic.topicId,
                    masteryScore: topic.masteryScore,
                    accuracy: topic.accuracy,
                    totalAttempts: topic.totalAttempts,
                    unresolvedMistakes: mistakes.length,
                    averageResponseTime: topic.averageResponseTime,
                    lastAttemptDate: topic.lastAttemptDate,
                    recommendations: generateTopicRecommendations(topic)
                };
            }));

        res.status(200).json({
            success: true,
            data: {
                weakTopics: weakTopicAnalysis,
                count: weakTopics.length
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get interview readiness score
// @route   GET /api/analytics/readiness/:userId
// @access  Private
exports.getReadinessScore = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.user._id;

        // Authorization check
        if (userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this data'
            });
        }

        // Calculate or get existing prediction
        let prediction = await Prediction.findOne({ userId }).populate('recommendedTopics.topicId learningPath.topicId');

        if (!prediction || (Date.now() - new Date(prediction.lastCalculated)) > 24 * 60 * 60 * 1000) {
            // Recalculate if older than 24 hours
            prediction = await calculateReadinessScore(userId);
        }

        res.status(200).json({
            success: true,
            data: prediction
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get admin dashboard analytics
// @route   GET /api/analytics/admin
// @access  Private (Admin)
exports.getAdminAnalytics = async (req, res, next) => {
    try {
        // Total questions by difficulty
        const questionsByDifficulty = await Question.aggregate([
            { $group: { _id: '$difficulty', count: { $sum: 1 } } }
        ]);

        // Total questions by status
        const questionsByStatus = await Question.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Total attempts
        const totalAttempts = await Attempt.countDocuments();

        // Total students
        const User = require('../models/User');
        const totalStudents = await User.countDocuments();

        // Average accuracy across all students
        const accuracyStats = await TopicStats.aggregate([
            {
                $group: {
                    _id: null,
                    avgAccuracy: { $avg: '$accuracy' },
                    avgMasteryScore: { $avg: '$masteryScore' }
                }
            }
        ]);

        // Most attempted questions
        const mostAttemptedQuestions = await Question.find()
            .sort({ 'statistics.totalAttempts': -1 })
            .limit(10)
            .select('questionText statistics difficulty');

        // Recent activity
        const recentAttempts = await Attempt.find()
            .sort({ timestamp: -1 })
            .limit(20)
            .populate('userId questionId');

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalQuestions: await Question.countDocuments(),
                    totalAttempts,
                    totalStudents,
                    avgAccuracy: accuracyStats[0]?.avgAccuracy ? accuracyStats[0].avgAccuracy.toFixed(2) : 0,
                    avgMasteryScore: accuracyStats[0]?.avgMasteryScore ? accuracyStats[0].avgMasteryScore.toFixed(2) : 0
                },
                questionsByDifficulty,
                questionsByStatus,
                mostAttemptedQuestions,
                recentActivity: recentAttempts
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get attempt history
// @route   GET /api/analytics/attempts/:userId
// @access  Private
// @desc    Get attempt history
// @route   GET /api/analytics/attempts/:userId
// @access  Private
exports.getAttemptHistory = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.user._id;
        const { page = 1, limit = 20, mode, topicId } = req.query;

        // Authorization check
        if (userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this data'
            });
        }

        const query = { userId };
        if (mode) query.mode = mode;
        if (topicId) query.topicId = topicId;

        const attempts = await Attempt.find(query)
            .populate('questionId topicId')
            .sort({ timestamp: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Attempt.countDocuments(query);

        res.status(200).json({
            success: true,
            data: attempts,
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

// @desc    Get quiz sessions history
// @route   GET /api/analytics/history/:userId
// @access  Private
exports.getQuizHistory = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.user._id;

        // Authorization check
        if (userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this data'
            });
        }

        const mongoose = require('mongoose');

        const sessions = await Attempt.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: "$sessionId",
                    userId: { $first: "$userId" },
                    mode: { $first: "$mode" },
                    timestamp: { $max: "$timestamp" },
                    totalQuestions: { $sum: 1 },
                    correctAnswers: { $sum: { $cond: ["$isCorrect", 1, 0] } },
                    avgResponseTime: { $avg: "$responseTime" },
                    topicId: { $first: "$topicId" }
                }
            },
            {
                $lookup: {
                    from: "topics",
                    localField: "topicId",
                    foreignField: "_id",
                    as: "topicDetails"
                }
            },
            { $unwind: { path: "$topicDetails", preserveNullAndEmptyArrays: true } },
            { $sort: { timestamp: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: sessions
        });
    } catch (error) {
        next(error);
    }
};

// Helper: Calculate performance trend
const calculatePerformanceTrend = async (userId) => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const attempts = await Attempt.find({
        userId,
        timestamp: { $gte: thirtyDaysAgo }
    }).sort({ timestamp: 1 });

    const dailyPerformance = {};

    attempts.forEach(attempt => {
        const date = new Date(attempt.timestamp).toISOString().split('T')[0];

        if (!dailyPerformance[date]) {
            dailyPerformance[date] = { total: 0, correct: 0 };
        }

        dailyPerformance[date].total += 1;
        if (attempt.isCorrect) {
            dailyPerformance[date].correct += 1;
        }
    });

    return Object.entries(dailyPerformance).map(([date, stats]) => ({
        date,
        accuracy: (stats.correct / stats.total) * 100,
        attempts: stats.total
    }));
};

// Helper: Generate topic recommendations
const generateTopicRecommendations = (topicStats) => {
    const recommendations = [];

    if (topicStats.accuracy < 40) {
        recommendations.push('Review fundamental concepts');
        recommendations.push('Start with easier questions');
    } else if (topicStats.accuracy < 60) {
        recommendations.push('Practice more questions');
        recommendations.push('Review explanations carefully');
    }

    if (topicStats.averageResponseTime > 120) {
        recommendations.push('Work on speed and efficiency');
    }

    const daysSinceLastAttempt = (Date.now() - new Date(topicStats.lastAttemptDate)) / (1000 * 60 * 60 * 24);

    if (daysSinceLastAttempt > 7) {
        recommendations.push('Regular practice needed');
    }

    return recommendations;
};

// Helper: Calculate readiness score
const calculateReadinessScore = async (userId) => {
    const mongoose = require('mongoose');

    // Fetch limited data and stats in parallel
    const [topicStats, attempts, generalStats] = await Promise.all([
        TopicStats.find({ userId }).populate('topicId'),
        Attempt.find({ userId }).sort({ timestamp: -1 }).limit(50),
        Attempt.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    avgResponseTime: { $avg: "$responseTime" },
                    count: { $sum: 1 }
                }
            }
        ])
    ]);

    if (topicStats.length === 0 || attempts.length === 0) {
        return await Prediction.findOneAndUpdate(
            { userId },
            {
                userId,
                interviewReadinessScore: 0,
                lastCalculated: Date.now()
            },
            { upsert: true, new: true }
        );
    }

    // Calculate accuracy score (0-100)
    const avgAccuracy = topicStats.reduce((sum, t) => sum + t.accuracy, 0) / topicStats.length;
    const accuracyScore = avgAccuracy;

    // Calculate speed consistency (0-100)
    const avgResponseTime = generalStats[0]?.avgResponseTime || 60;
    const speedScore = Math.min(100, (60 / avgResponseTime) * 100);

    // Calculate improvement trend (Using the 50 fetched attempts)
    const recentAttempts = attempts.slice(0, 20);
    const olderAttempts = attempts.slice(20, 50);

    const recentAccuracy = (recentAttempts.filter(a => a.isCorrect).length / Math.max(recentAttempts.length, 1)) * 100;
    const olderAccuracy = olderAttempts.length > 0
        ? (olderAttempts.filter(a => a.isCorrect).length / olderAttempts.length) * 100
        : recentAccuracy;

    const improvement = recentAccuracy - olderAccuracy;
    const improvementScore = Math.min(100, Math.max(0, 50 + (improvement * 2)));

    // Calculate confidence behavior (using fetched attempts)
    const highConfidenceAttempts = attempts.filter(a => a.confidence === 'high');
    const highConfidenceCorrect = highConfidenceAttempts.filter(a => a.isCorrect).length;
    const confidenceScore = highConfidenceAttempts.length > 0
        ? (highConfidenceCorrect / highConfidenceAttempts.length) * 100
        : 50;

    // Weighted score
    const interviewReadinessScore = (
        accuracyScore * 0.4 +
        speedScore * 0.3 +
        improvementScore * 0.2 +
        confidenceScore * 0.1
    );

    // Topic recommendations
    const recommendedTopics = topicStats
        .filter(t => t.masteryScore < 75)
        .sort((a, b) => a.masteryScore - b.masteryScore)
        .slice(0, 5)
        .map(t => ({
            topicId: t.topicId,
            priority: t.masteryScore < 40 ? 'high' : t.masteryScore < 60 ? 'medium' : 'low',
            reason: `Low mastery score: ${t.masteryScore.toFixed(2)}%`,
            estimatedTime: Math.ceil((100 - t.masteryScore) / 10)
        }));

    // Update or create prediction
    const prediction = await Prediction.findOneAndUpdate(
        { userId },
        {
            userId,
            interviewReadinessScore,
            scoreBreakdown: {
                accuracy: { score: accuracyScore, weight: 0.4 },
                speedConsistency: { score: speedScore, weight: 0.3 },
                improvementTrend: { score: improvementScore, weight: 0.2 },
                confidenceBehavior: { score: confidenceScore, weight: 0.1 }
            },
            recommendedTopics,
            lastCalculated: Date.now()
        },
        { upsert: true, new: true }
    ).populate('recommendedTopics.topicId');

    return prediction;
};

module.exports = exports;
