const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
    try {
        const { role, isActive, page = 1, limit = 20, search } = req.query;

        const query = {};

        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res, next) => {
    try {
        const { name, email, role, isActive } = req.body;

        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from deactivating themselves
        if (req.user._id.toString() === req.params.id && isActive === false) {
            return res.status(400).json({
                success: false,
                message: 'You cannot deactivate your own account'
            });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;
        if (isActive !== undefined) updateData.isActive = isActive;

        user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from deleting themselves
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get activity logs
// @route   GET /api/admin/activity-logs
// @access  Private (Admin)
exports.getActivityLogs = async (req, res, next) => {
    try {
        const { userId, action, page = 1, limit = 50, startDate, endDate } = req.query;

        const query = {};

        if (userId) query.userId = userId;
        if (action) query.action = action;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const logs = await ActivityLog.find(query)
            .populate('userId', 'name email')
            .sort({ timestamp: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await ActivityLog.countDocuments(query);

        res.status(200).json({
            success: true,
            data: logs,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getSystemStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        const Question = require('../models/Question');
        const Topic = require('../models/Topic');
        const Attempt = require('../models/Attempt');

        const totalQuestions = await Question.countDocuments();
        const activeQuestions = await Question.countDocuments({ status: 'active' });
        const totalTopics = await Topic.countDocuments();
        const totalAttempts = await Attempt.countDocuments();

        // Recent registrations (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentRegistrations = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        res.status(200).json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    students: totalStudents,
                    admins: totalAdmins,
                    recentRegistrations
                },
                content: {
                    totalQuestions,
                    activeQuestions,
                    totalTopics,
                    totalAttempts
                }
            }
        });
    } catch (error) {
        next(error);
    }
};
