const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: [true, 'Topic is required']
    },
    questionText: {
        type: String,
        required: [true, 'Question text is required'],
        trim: true
    },
    questionType: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'fill-blank'],
        default: 'multiple-choice'
    },
    options: [{
        text: String,
        isCorrect: Boolean
    }],
    correctAnswer: {
        type: String,
        required: [true, 'Correct answer is required']
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard', 'expert'],
        default: 'medium'
    },
    difficultyScore: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
    },
    tags: [{
        type: String,
        trim: true
    }],
    expectedTime: {
        type: Number, // in seconds
        default: 60
    },
    explanation: {
        type: String,
        default: ''
    },
    hints: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'review'],
        default: 'active'
    },
    source: {
        type: String,
        enum: ['local', 'opentdb', 'built-in'],
        default: 'local'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    statistics: {
        totalAttempts: {
            type: Number,
            default: 0
        },
        correctAttempts: {
            type: Number,
            default: 0
        },
        averageTime: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Index for efficient querying
questionSchema.index({ topicId: 1, difficulty: 1, status: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ difficultyScore: 1 });

module.exports = mongoose.model('Question', questionSchema);
