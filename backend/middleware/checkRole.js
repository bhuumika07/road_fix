const checkRole = (roles) => {
    return (req, res, next) => {
        // Prefer req.user.role when using real auth middleware,
        // but fall back to header-based roles for this project.
        const userRole =
            req.user?.role ||
            req.headers['x-user-role'] ||
            req.headers['X-User-Role'];

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                error: 'Access denied',
                message: 'Access denied'
            });
        }

        next();
    };
};

module.exports = checkRole;