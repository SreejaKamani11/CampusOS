const AppError = require('../utils/AppError');

function roleGuard(...allowedRoles) {
  return (req, res, next) => {

    console.log("========== ROLE GUARD ==========");
    console.log("Allowed Roles:", allowedRoles);
    console.log("req.user:", req.user);
    console.log("req.user.role:", req.user?.role);
    console.log("================================");

    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    if (allowedRoles.length === 0) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403, 'FORBIDDEN'));
    }

    return next();
  };
}

module.exports = roleGuard;