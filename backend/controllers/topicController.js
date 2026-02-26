const Topic = require('../models/Topic');

// @desc    Get all topics (hierarchical)
// @route   GET /api/topics
// @access  Private
exports.getAllTopics = async (req, res, next) => {
    try {
        const { subject, topic, subtopic, search } = req.query;

        const query = { isActive: true };

        if (subject) query.subject = subject;
        if (topic) query.topic = topic;
        if (subtopic) query.subtopic = subtopic;
        if (search) {
            query.$or = [
                { subject: { $regex: search, $options: 'i' } },
                { topic: { $regex: search, $options: 'i' } },
                { subtopic: { $regex: search, $options: 'i' } },
                { concept: { $regex: search, $options: 'i' } }
            ];
        }

        const topics = await Topic.find(query).sort({ subject: 1, order: 1 });

        // Group topics hierarchically
        const hierarchy = {};

        topics.forEach(t => {
            if (!hierarchy[t.subject]) {
                hierarchy[t.subject] = {};
            }
            if (!hierarchy[t.subject][t.topic]) {
                hierarchy[t.subject][t.topic] = {};
            }
            if (!hierarchy[t.subject][t.topic][t.subtopic]) {
                hierarchy[t.subject][t.topic][t.subtopic] = [];
            }
            hierarchy[t.subject][t.topic][t.subtopic].push({
                _id: t._id,
                concept: t.concept,
                description: t.description
            });
        });

        res.status(200).json({
            success: true,
            data: {
                topics,
                hierarchy
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single topic
// @route   GET /api/topics/:id
// @access  Private
exports.getTopic = async (req, res, next) => {
    try {
        const topic = await Topic.findById(req.params.id);

        if (!topic) {
            return res.status(404).json({
                success: false,
                message: 'Topic not found'
            });
        }

        res.status(200).json({
            success: true,
            data: topic
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create topic
// @route   POST /api/topics
// @access  Private (Admin)
exports.createTopic = async (req, res, next) => {
    try {
        const topic = await Topic.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Topic created successfully',
            data: topic
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update topic
// @route   PUT /api/topics/:id
// @access  Private (Admin)
exports.updateTopic = async (req, res, next) => {
    try {
        let topic = await Topic.findById(req.params.id);

        if (!topic) {
            return res.status(404).json({
                success: false,
                message: 'Topic not found'
            });
        }

        topic = await Topic.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Topic updated successfully',
            data: topic
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete topic
// @route   DELETE /api/topics/:id
// @access  Private (Admin)
exports.deleteTopic = async (req, res, next) => {
    try {
        const topic = await Topic.findById(req.params.id);

        if (!topic) {
            return res.status(404).json({
                success: false,
                message: 'Topic not found'
            });
        }

        await topic.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Topic deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all subjects
// @route   GET /api/topics/subjects
// @access  Private
exports.getSubjects = async (req, res, next) => {
    try {
        const subjects = await Topic.distinct('subject');

        res.status(200).json({
            success: true,
            data: subjects
        });
    } catch (error) {
        next(error);
    }
};
