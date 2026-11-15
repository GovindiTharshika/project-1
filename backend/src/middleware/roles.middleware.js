/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/middleware/roles.middleware.js
 * Description: Role-Based Access Control (RBAC) Guard Middleware
 * Evaluates authenticated user claims against allowed roles for a protected route.
 * Restricts sensitive administrative, inventory, and fulfillment operations.
 * ============================================================================
 */

/**
 * Higher-order middleware factory that creates an RBAC authorization guard
 * @param {string[]} allowedRoles - Array of roles permitted to access the route ('admin', 'sales', 'customer')
 * @returns {function} Express/Node.js style middleware handler
 */
function requireRole(allowedRoles = []) {
  return function (req, res, next) {
    // Guard 1: Verify that authentication middleware previously populated req.user
    if (!req.user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        error: 'Unauthorized: User authentication required before evaluating role permissions'
      }));
    }

    // Guard 2: Verify that the user's role exists within the authorized roles array
    if (!allowedRoles.includes(req.user.role)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        error: `Forbidden: Access requires one of [${allowedRoles.join(', ')}]. Current role: '${req.user.role}'`
      }));
    }

    // Role authorized: Proceed to next controller handler
    if (typeof next === 'function') {
      next();
    }
  };
}

// Export RBAC factory function
module.exports = requireRole;
