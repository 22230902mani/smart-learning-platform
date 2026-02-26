const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const MistakeLog = require('../models/MistakeLog');
const TopicStats = require('../models/TopicStats');
const Topic = require('../models/Topic');
const { v4: uuidv4 } = require('uuid');

// Helper function to calculate next difficulty
const calculateNextDifficulty = async (userId, topicFilter) => {
    const recentAttempts = await Attempt.find({
        userId,
        ...topicFilter
    }).sort({ timestamp: -1 }).limit(5);

    if (recentAttempts.length < 3) {
        return 'easy';
    }

    const correctCount = recentAttempts.filter(a => a.isCorrect).length;
    const accuracy = correctCount / recentAttempts.length;

    // Get current difficulty
    const lastDifficulty = recentAttempts[0].difficultyAttempt;

    const difficultyLevels = ['easy', 'medium', 'hard', 'expert'];
    const currentIndex = difficultyLevels.indexOf(lastDifficulty);

    // Adaptive logic
    if (accuracy >= 0.8 && currentIndex < 3) {
        // Increase difficulty
        return difficultyLevels[currentIndex + 1];
    } else if (accuracy <= 0.4 && currentIndex > 0) {
        // Decrease difficulty
        return difficultyLevels[currentIndex - 1];
    }

    return lastDifficulty || 'medium';
};

// @desc    Start quiz session
// @route   POST /api/quiz/start
// @access  Private
exports.startQuiz = async (req, res, next) => {
    try {
        const { mode, topicId, subject, questionCount = 10 } = req.body;
        const userId = req.user._id;

        console.log(`[Quiz] Starting quiz: subject="${subject}", mode="${mode}", count=${questionCount}`);

        // Determine topic filter
        let topicFilter = {};
        if (topicId) {
            topicFilter = { topicId };
        } else if (subject) {
            const topics = await Topic.find({ subject });
            const topicIds = topics.map(t => t._id);
            if (topicIds.length > 0) {
                topicFilter = { topicId: { $in: topicIds } };
            } else {
                topicFilter = { topicId: null };
            }
        }

        // Validate mode
        const validModes = ['practice', 'timed', 'revision'];
        if (!validModes.includes(mode)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid quiz mode'
            });
        }

        // Generate session ID
        const sessionId = uuidv4();

        let questions = [];

        // Import question bank
        const { getQuestionsFromBank, hasSubjectInBank } = require('../services/questionBank');
        const isProgrammingSubject = hasSubjectInBank(subject);

        if (mode === 'revision') {
            console.log(`[Quiz] Revision mode: checking mistake logs for user ${userId}`);
            // Get questions from mistake logs
            const mistakes = await MistakeLog.find({
                userId,
                resolved: false,
                ...topicFilter
            }).populate('questionId').limit(questionCount);

            questions = mistakes.map(m => m.questionId).filter(q => q);
            console.log(`[Quiz] Found ${questions.length} existing mistakes`);

            if (questions.length < questionCount) {
                const additionalCount = questionCount - questions.length;
                console.log(`[Quiz] Revision fallback: need ${additionalCount} more questions`);

                // If it's a programming subject, try to get from bank first
                if (isProgrammingSubject) {
                    const bankQuestions = getQuestionsFromBank(additionalCount, subject);
                    console.log(`[Quiz] Got ${bankQuestions.length} fallback questions from bank`);

                    // We need to find/create a default topic for these
                    let defaultTopic;
                    if (topicId) {
                        defaultTopic = await Topic.findById(topicId);
                    }
                    if (!defaultTopic && subject) {
                        defaultTopic = await Topic.findOne({ subject });
                    }
                    if (!defaultTopic) {
                        defaultTopic = await Topic.findOneAndUpdate(
                            { subject: subject, topic: 'General', subtopic: 'Mixed', concept: 'Various' },
                            { subject: subject, topic: 'General', subtopic: 'Mixed', concept: 'Various', isActive: true },
                            { upsert: true, new: true }
                        );
                    }

                    for (const bq of bankQuestions) {
                        try {
                            const savedQ = await Question.findOneAndUpdate(
                                { questionText: bq.questionText },
                                {
                                    $setOnInsert: {
                                        ...bq,
                                        topicId: defaultTopic._id,
                                        createdBy: userId
                                    }
                                },
                                { upsert: true, new: true }
                            );
                            if (!questions.find(q => q._id.toString() === savedQ._id.toString())) {
                                questions.push(savedQ);
                            }
                        } catch (e) { }
                    }
                }

                // If still not enough, try existing questions in DB
                if (questions.length < questionCount) {
                    const dbShortfall = questionCount - questions.length;
                    const additionalQuestions = await Question.find({
                        ...topicFilter,
                        status: 'active',
                        _id: { $nin: questions.map(q => q._id) }
                    }).limit(dbShortfall);

                    questions = [...questions, ...additionalQuestions];
                }
            }
        } else {
            // For programming subjects, use built-in question bank FIRST
            if (isProgrammingSubject) {
                console.log(`[Quiz] "${subject}" is a programming subject - using built-in bank`);
                const bankQuestions = getQuestionsFromBank(questionCount, subject);
                console.log(`[Quiz] Got ${bankQuestions.length} questions from built-in bank`);

                // Find or create topic for saving
                let defaultTopic;
                if (topicId) {
                    defaultTopic = await Topic.findById(topicId);
                }
                if (!defaultTopic && subject) {
                    defaultTopic = await Topic.findOne({ subject });
                }
                if (!defaultTopic) {
                    defaultTopic = await Topic.findOneAndUpdate(
                        { subject: subject, topic: 'General', subtopic: 'Mixed', concept: 'Various' },
                        { subject: subject, topic: 'General', subtopic: 'Mixed', concept: 'Various', isActive: true },
                        { upsert: true, new: true }
                    );
                }

                // Save bank questions to DB so submit/results work
                for (const bq of bankQuestions) {
                    try {
                        const savedQ = await Question.findOneAndUpdate(
                            { questionText: bq.questionText },
                            {
                                $set: {
                                    topicId: defaultTopic._id,
                                    createdBy: userId,
                                    // Ensure all required fields from bank are present
                                    ...bq
                                }
                            },
                            { upsert: true, new: true }
                        );
                        questions.push(savedQ);
                    } catch (saveErr) {
                        const existing = await Question.findOne({ questionText: bq.questionText });
                        if (existing) questions.push(existing);
                    }
                }
            } else {
                // For non-programming subjects, use local DB
                const difficulty = await calculateNextDifficulty(userId, topicFilter);

                questions = await Question.find({
                    ...topicFilter,
                    difficulty,
                    status: 'active'
                }).limit(questionCount);

                if (questions.length < questionCount) {
                    questions = await Question.find({
                        ...topicFilter,
                        status: 'active'
                    }).limit(questionCount);
                }
            }
        }

        // FALLBACK: External API if still not enough
        if (questions.length < questionCount) {
            const shortfall = questionCount - questions.length;
            console.log(`[Quiz] Need ${shortfall} more questions. Trying external API...`);

            try {
                const { fetchQuestionsFromOpenTDB } = require('../services/opentdbService');
                const externalQuestions = await fetchQuestionsFromOpenTDB(shortfall, subject || null, null);

                if (externalQuestions.length > 0) {
                    let defaultTopic;
                    if (topicId) {
                        defaultTopic = await Topic.findById(topicId);
                    }
                    if (!defaultTopic && subject) {
                        defaultTopic = await Topic.findOne({ subject });
                    }
                    if (!defaultTopic) {
                        defaultTopic = await Topic.findOneAndUpdate(
                            { subject: subject || 'General Knowledge', topic: 'General', subtopic: 'Mixed', concept: 'Various' },
                            { subject: subject || 'General Knowledge', topic: 'General', subtopic: 'Mixed', concept: 'Various', isActive: true },
                            { upsert: true, new: true }
                        );
                    }

                    for (const extQ of externalQuestions) {
                        try {
                            const savedQ = await Question.findOneAndUpdate(
                                { questionText: extQ.questionText },
                                {
                                    $set: {
                                        ...extQ,
                                        topicId: defaultTopic._id,
                                        createdBy: userId
                                    }
                                },
                                { upsert: true, new: true }
                            );
                            questions.push(savedQ);
                        } catch (saveErr) {
                            console.warn('[Quiz] External question save skipped:', saveErr.message);
                        }
                    }
                }
            } catch (extError) {
                console.error('[Quiz] External API failed:', extError.message);
            }
        }

        console.log(`[Quiz] Final question count: ${questions.length}`);

        // Format questions (hide correct answers)
        const formattedQuestions = questions.map(q => ({
            _id: q._id,
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.options.map(opt => ({ text: opt.text })),
            difficulty: q.difficulty,
            expectedTime: q.expectedTime,
            hints: q.hints,
            topicId: q.topicId
        }));

        res.status(200).json({
            success: true,
            data: {
                sessionId,
                mode,
                questions: formattedQuestions,
                totalQuestions: formattedQuestions.length
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit answer
// @route   POST /api/quiz/submit
// @access  Private
exports.submitAnswer = async (req, res, next) => {
    try {
        const { sessionId, questionId, selectedAnswer, responseTime, confidence } = req.body;
        const userId = req.user._id;

        // Get question
        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Patch missing topicId if necessary (legacy fallback)
        if (!question.topicId) {
            console.warn(`[Quiz] Question ${questionId} missing topicId, patching...`);
            let defaultTopic = await Topic.findOne({ subject: question.tags[0] || 'General Knowledge' });
            if (!defaultTopic) {
                defaultTopic = await Topic.findOneAndUpdate(
                    { subject: 'General Knowledge', topic: 'General', concept: 'Various' },
                    { subject: 'General Knowledge', topic: 'General', concept: 'Various', isActive: true },
                    { upsert: true, new: true }
                );
            }
            question.topicId = defaultTopic._id;
            await question.save();
        }

        // Check if answer is correct
        const isCorrect = selectedAnswer === question.correctAnswer;

        // Check for retry
        const existingAttempt = await Attempt.findOne({
            userId,
            sessionId,
            questionId
        });

        const retryCount = existingAttempt ? existingAttempt.retryCount + 1 : 0;

        // Create attempt
        const attempt = await Attempt.create({
            userId,
            sessionId,
            mode: req.body.mode || 'practice',
            topicId: question.topicId,
            questionId,
            selectedAnswer,
            isCorrect,
            responseTime,
            retryCount,
            difficultyAttempt: question.difficulty,
            confidence: confidence || 'medium'
        });

        // Update statistics in background (Don't await to keep response fast)
        const runBackgroundUpdates = async () => {
            try {
                // Initialize statistics if they don't exist
                if (!question.statistics) {
                    question.statistics = { totalAttempts: 0, correctAttempts: 0, averageTime: 0 };
                }

                // Update question statistics
                question.statistics.totalAttempts += 1;
                if (isCorrect) {
                    question.statistics.correctAttempts += 1;
                }
                question.statistics.averageTime =
                    (question.statistics.averageTime * (question.statistics.totalAttempts - 1) + responseTime)
                    / question.statistics.totalAttempts;
                await question.save();

                // Handle mistake logging
                if (!isCorrect) {
                    let mistakeLog = await MistakeLog.findOne({ userId, questionId });

                    if (mistakeLog) {
                        mistakeLog.mistakeCount += 1;
                        mistakeLog.lastMistakeDate = Date.now();
                        mistakeLog.consecutiveCorrect = 0;
                    } else {
                        mistakeLog = await MistakeLog.create({
                            userId,
                            questionId,
                            topicId: question.topicId,
                            attemptId: attempt._id
                        });
                    }
                    await mistakeLog.save();
                } else {
                    let mistakeLog = await MistakeLog.findOne({ userId, questionId });
                    if (mistakeLog) {
                        mistakeLog.consecutiveCorrect += 1;
                        if (mistakeLog.consecutiveCorrect >= 3) {
                            mistakeLog.resolved = true;
                            mistakeLog.resolvedDate = Date.now();
                        }
                        await mistakeLog.save();
                    }
                }

                // Update topic statistics
                await updateTopicStats(userId, question.topicId, isCorrect, responseTime);
            } catch (bgError) {
                console.error('[Quiz] Background update failed:', bgError.message);
            }
        };

        // Fire and forget background updates
        runBackgroundUpdates();

        res.status(200).json({
            success: true,
            data: {
                isCorrect,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
                attempt
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get quiz results
// @route   GET /api/quiz/results/:sessionId
// @access  Private
exports.getQuizResults = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user._id;

        const attempts = await Attempt.find({ userId, sessionId })
            .populate('questionId')
            .populate('topicId');

        if (!attempts.length) {
            return res.status(404).json({
                success: false,
                message: 'No attempts found for this session'
            });
        }

        const totalQuestions = attempts.length;
        const correctAnswers = attempts.filter(a => a.isCorrect).length;
        const accuracy = (correctAnswers / totalQuestions) * 100;
        const totalTime = attempts.reduce((sum, a) => sum + a.responseTime, 0);
        const averageTime = totalTime / totalQuestions;

        res.status(200).json({
            success: true,
            data: {
                sessionId,
                totalQuestions,
                correctAnswers,
                incorrectAnswers: totalQuestions - correctAnswers,
                accuracy: accuracy.toFixed(2),
                totalTime,
                averageTime: averageTime.toFixed(2),
                attempts
            }
        });
    } catch (error) {
        next(error);
    }
};

// Helper function to update topic statistics
const updateTopicStats = async (userId, topicId, isCorrect, responseTime) => {
    let stats = await TopicStats.findOne({ userId, topicId });

    if (!stats) {
        stats = await TopicStats.create({
            userId,
            topicId,
            totalAttempts: 0,
            correctAttempts: 0
        });
    }

    stats.totalAttempts += 1;
    if (isCorrect) {
        stats.correctAttempts += 1;
    }

    stats.accuracy = (stats.correctAttempts / stats.totalAttempts) * 100;
    stats.lastAttemptDate = Date.now();

    // Update average response time
    stats.averageResponseTime =
        (stats.averageResponseTime * (stats.totalAttempts - 1) + responseTime)
        / stats.totalAttempts;

    // Calculate mastery score (weighted: 50% accuracy, 30% recency, 20% consistency)
    const accuracyScore = stats.accuracy;
    const recencyScore = calculateRecencyScore(stats.lastAttemptDate);
    const consistencyScore = calculateConsistencyScore(stats.averageResponseTime);

    stats.masteryScore = (
        accuracyScore * 0.5 +
        recencyScore * 0.3 +
        consistencyScore * 0.2
    );

    // Update recent performance
    const today = new Date().toISOString().split('T')[0];
    const recentIndex = stats.recentPerformance.findIndex(
        p => new Date(p.date).toISOString().split('T')[0] === today
    );

    if (recentIndex >= 0) {
        stats.recentPerformance[recentIndex].count += 1;
        if (isCorrect) {
            stats.recentPerformance[recentIndex].accuracy =
                ((stats.recentPerformance[recentIndex].accuracy *
                    (stats.recentPerformance[recentIndex].count - 1)) + 100) /
                stats.recentPerformance[recentIndex].count;
        } else {
            stats.recentPerformance[recentIndex].accuracy =
                (stats.recentPerformance[recentIndex].accuracy *
                    (stats.recentPerformance[recentIndex].count - 1)) /
                stats.recentPerformance[recentIndex].count;
        }
    } else {
        stats.recentPerformance.push({
            date: Date.now(),
            accuracy: isCorrect ? 100 : 0,
            count: 1
        });

        // Keep only last 30 days
        if (stats.recentPerformance.length > 30) {
            stats.recentPerformance = stats.recentPerformance.slice(-30);
        }
    }

    await stats.save();
};

// Calculate recency score (0-100)
const calculateRecencyScore = (lastAttemptDate) => {
    const daysSinceLastAttempt = (Date.now() - new Date(lastAttemptDate)) / (1000 * 60 * 60 * 24);

    if (daysSinceLastAttempt <= 1) return 100;
    if (daysSinceLastAttempt <= 3) return 80;
    if (daysSinceLastAttempt <= 7) return 60;
    if (daysSinceLastAttempt <= 14) return 40;
    if (daysSinceLastAttempt <= 30) return 20;
    return 10;
};

// Calculate consistency score (0-100)
const calculateConsistencyScore = (averageResponseTime) => {
    // Lower response time = higher score (assuming expected time is around 60 seconds)
    const idealTime = 60;
    const ratio = idealTime / (averageResponseTime || idealTime);

    return Math.min(100, Math.max(0, ratio * 100));
};

module.exports = exports;
