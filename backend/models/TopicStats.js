const mongoose = require('mongoose');

const topicStatsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    totalAttempts: {
        type: Number,
        default: 0
    },
    correctAttempts: {
        type: Number,
        default: 0
    },
    accuracy: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    masteryScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    averageResponseTime: {
        type: Number,
        default: 0
    },
    lastAttemptDate: {
        type: Date,
        default: Date.now
    },
    recentPerformance: [{
        date: Date,
        accuracy: Number,
        count: Number
    }],
    difficultyProgression: {
        current: {
            type: String,
            enum: ['easy', 'medium', 'hard', 'expert'],
            default: 'easy'
        },
        history: [{
            level: String,
            achievedAt: Date
        }]
    },
    weeklyProgress: [{
        week: Number,
        year: Number,
        attempts: Number,
        accuracy: Number,
        improvement: Number
    }]
}, {
    timestamps: true
});

// Compound index for user and topic
topicStatsSchema.index({ userId: 1, topicId: 1 }, { unique: true });
topicStatsSchema.index({ userId: 1, masteryScore: 1 });

module.exports = mongoose.model('TopicStats', topicStatsSchema);
