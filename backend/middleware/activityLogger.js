const ActivityLog = require('../models/ActivityLog');

// Log activity
exports.logActivity = (action, resource = null) => {
    return async (req, res, next) => {
        try {
            const userId = req.user ? req.user._id : null;

            // Store original send function
            const originalSend = res.send;

            // Override send function to log after response
            res.send = function (data) {
                // Create activity log
                if (userId) {
                    ActivityLog.create({
                        userId,
                        action,
                        resource,
                        resourceId: req.params.id || (req.body && req.body._id),
                        details: {
                            method: req.method,
                            path: req.path,
                            body: sanitizeBody(req.body)
                        },
                        ipAddress: req.ip,
                        userAgent: req.get('user-agent'),
                        status: res.statusCode >= 200 && res.statusCode < 300 ? 'success' : 'failure'
                    }).catch(err => console.error('Activity log error:', err));
                }

                // Call original send
                originalSend.call(this, data);
            };

            next();
        } catch (error) {
            console.error('Activity logging error:', error);
            next();
        }
    };
};

// Sanitize sensitive data from body
const sanitizeBody = (body) => {
    if (!body) return {};

    const sanitized = { ...body };

    // Remove sensitive fields
    delete sanitized.password;
    delete sanitized.refreshToken;
    delete sanitized.token;

    return sanitized;
};
