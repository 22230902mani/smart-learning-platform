const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    interviewReadinessScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    scoreBreakdown: {
        accuracy: {
            score: Number,
            weight: Number
        },
        speedConsistency: {
            score: Number,
            weight: Number
        },
        improvementTrend: {
            score: Number,
            weight: Number
        },
        confidenceBehavior: {
            score: Number,
            weight: Number
        }
    },
    recommendedTopics: [{
        topicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Topic'
        },
        priority: {
            type: String,
            enum: ['high', 'medium', 'low']
        },
        reason: String,
        estimatedTime: Number // in hours
    }],
    learningPath: [{
        step: Number,
        topicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Topic'
        },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending'
        },
        completedAt: Date
    }],
    strengths: [{
        area: String,
        score: Number
    }],
    weaknesses: [{
        area: String,
        score: Number,
        actionItems: [String]
    }],
    nextReviewDate: {
        type: Date
    },
    lastCalculated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient lookups
predictionSchema.index({ userId: 1 });
predictionSchema.index({ interviewReadinessScore: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);
