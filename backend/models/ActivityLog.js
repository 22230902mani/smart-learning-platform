const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'login',
            'logout',
            'register',
            'quiz_start',
            'quiz_complete',
            'profile_update',
            'question_create',
            'question_update',
            'question_delete',
            'topic_create',
            'topic_update',
            'topic_delete',
            'user_create',
            'user_update',
            'user_delete'
        ]
    },
    resource: {
        type: String // e.g., 'Question', 'Topic', 'User'
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    status: {
        type: String,
        enum: ['success', 'failure', 'pending'],
        default: 'success'
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: false
});

// Indexes for efficient querying
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, timestamp: -1 });
activityLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
