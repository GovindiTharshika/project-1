/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/modules/auth/auth.controller.js
 * Description: Authentication Controller Layer
 * Handles incoming HTTP requests for user login, registration, and session info.
 * Maps parameters to AuthService and sends standardized JSON HTTP responses.
 * ============================================================================
 */

// Import authentication business logic service
const authService = require('./auth.service');

class AuthController {
  /**
   * Handles POST /api/v1/auth/login
   * @param {object} req - HTTP request
   * @param {object} res - HTTP response
   * @param {object} body - Parsed JSON body { email, password }
   */
  async handleLogin(req, res, body) {
    try {
      // Delegate authentication verification to the service layer
      const result = await authService.login(body.email, body.password);

      // Return 200 OK with issued token and user data
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      // Return appropriate HTTP error status (400, 401, 403, or 500)
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }

  /**
   * Handles POST /api/v1/auth/register
   * @param {object} req - HTTP request
   * @param {object} res - HTTP response
   * @param {object} body - Parsed JSON body { name, email, company, role, password }
   */
  async handleRegister(req, res, body) {
    try {
      // Delegate user creation to the service layer
      const result = await authService.register(body);

      // Return 201 Created with onboarding token and profile
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      // Return error response with validation status
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }

  /**
   * Handles GET /api/v1/auth/me
   * Returns current authenticated user claims extracted from validated JWT
   * @param {object} req - HTTP request (contains req.user from authMiddleware)
   * @param {object} res - HTTP response
   */
  async handleMe(req, res) {
    // Return 200 OK with claims attached to request
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ user: req.user }));
  }
}

// Export singleton instance of AuthController
module.exports = new AuthController();
