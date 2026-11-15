/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/middleware/auth.middleware.js
 * Description: JWT Authentication Interceptor
 * Intercepts incoming requests, extracts the RFC 7519 Bearer token from the
 * Authorization HTTP header, verifies the cryptographic signature, and attaches
 * the authenticated user identity (claims) to `req.user`.
 * ============================================================================
 */

// Import the cryptographic verification function from our JWT configuration module
const { verify } = require('../config/jwt');

/**
 * Authentication middleware guard
 * @param {object} req - Node.js HTTP incoming message request object
 * @param {object} res - Node.js HTTP server response object
 * @param {function} next - Callback function to proceed to the next handler
 */
function authMiddleware(req, res, next) {
  // Read the Authorization header case-insensitively
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  // Guard: Return 401 if header is absent
  if (!authHeader) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      error: 'Unauthorized: Authorization header is missing. Please provide a Bearer JWT token.'
    }));
  }

  // Split the header into authentication scheme and token value (e.g., "Bearer eyJhbG...")
  const [scheme, token] = authHeader.split(' ');

  // Guard: Ensure scheme is strictly 'Bearer' and token exists
  if (!token || scheme.toLowerCase() !== 'bearer') {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      error: 'Unauthorized: Invalid token format. Format must be "Bearer <jwt-token>".'
    }));
  }

  try {
    // Cryptographically verify HMAC-SHA256 signature and check token expiration
    const decodedClaims = verify(token);

    // Attach decoded user claims (sub, email, role, company, name) to request context
    req.user = decodedClaims;

    // Proceed to the controller handler
    if (typeof next === 'function') {
      next();
    }
  } catch (err) {
    // Return 401 Unauthorized if token signature is invalid or token has expired
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      error: `Unauthorized: ${err.message}`
    }));
  }
}

// Export middleware for use across authenticated endpoints
module.exports = authMiddleware;
