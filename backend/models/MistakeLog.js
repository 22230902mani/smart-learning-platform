const mongoose = require('mongoose');

const mistakeLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    attemptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attempt'
    },
    mistakeCount: {
        type: Number,
        default: 1
    },
    lastMistakeDate: {
        type: Date,
        default: Date.now
    },
    resolved: {
        type: Boolean,
        default: false
    },
    resolvedDate: {
        type: Date
    },
    consecutiveCorrect: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Compound index for user and question
mistakeLogSchema.index({ userId: 1, questionId: 1 }, { unique: true });
mistakeLogSchema.index({ userId: 1, topicId: 1, resolved: 1 });

module.exports = mongoose.model('MistakeLog', mistakeLogSchema);
