const mongoose = require('mongoose');

const LiveQuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a quiz title'],
        trim: true
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject']
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    joinId: {
        type: String,
        required: true,
        unique: true
    },
    timeLimit: {
        type: Number,
        required: [true, 'Please add a time limit (minutes)'],
        default: 10
    },
    questions: [{
        questionText: {
            type: String,
            required: true
        },
        options: [{
            type: String,
            required: true
        }],
        correctAnswer: {
            type: Number,
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['waiting', 'live', 'finished'],
        default: 'waiting'
    },
    participants: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        name: String,
        score: {
            type: Number,
            default: 0
        },
        accuracy: {
            type: Number,
            default: 0
        },
        completed: {
            type: Boolean,
            default: false
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }],
    startTime: Date,
    endTime: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LiveQuiz', LiveQuizSchema);
