const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    topic: {
        type: String,
        required: [true, 'Topic is required'],
        trim: true
    },
    subtopic: {
        type: String,
        required: [true, 'Subtopic is required'],
        trim: true
    },
    concept: {
        type: String,
        required: [true, 'Concept is required'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Create compound index for hierarchical structure
topicSchema.index({ subject: 1, topic: 1, subtopic: 1, concept: 1 }, { unique: true });

module.exports = mongoose.model('Topic', topicSchema);
