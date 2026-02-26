const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    mode: {
        type: String,
        enum: ['practice', 'timed', 'revision'],
        required: true
    },
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    selectedAnswer: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    responseTime: {
        type: Number, // in seconds
        required: true
    },
    retryCount: {
        type: Number,
        default: 0
    },
    hintsUsed: {
        type: Number,
        default: 0
    },
    difficultyAttempt: {
        type: String,
        enum: ['easy', 'medium', 'hard', 'expert']
    },
    confidence: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
attemptSchema.index({ userId: 1, sessionId: 1 });
attemptSchema.index({ userId: 1, topicId: 1, timestamp: -1 });
attemptSchema.index({ questionId: 1, isCorrect: 1 });

module.exports = mongoose.model('Attempt', attemptSchema);
