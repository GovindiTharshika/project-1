/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/modules/users/users.controller.js
 * Description: Users Controller Layer
 * Handles administrative endpoints for listing platform users and toggling
 * account active/inactive statuses.
 * ============================================================================
 */

// Import users business logic service
const usersService = require('./users.service');

class UsersController {
  /**
   * Handles GET /api/v1/users
   * Retrieves list of all accounts (Admin role required)
   * @param {object} req - HTTP request
   * @param {object} res - HTTP response
   */
  async handleGetAll(req, res) {
    try {
      const data = await usersService.findAll();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, count: data.length, data }));
    } catch (err) {
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }

  /**
   * Handles PATCH /api/v1/users/:id/toggle
   * Activates or deactivates an account (Admin role required)
   * @param {object} req - HTTP request (contains req.user)
   * @param {object} res - HTTP response
   * @param {string} id - Target user ID from URL
   */
  async handleToggleStatus(req, res, id) {
    try {
      const data = await usersService.toggleStatus(id, req.user);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data }));
    } catch (err) {
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }
}

// Export singleton instance of UsersController
module.exports = new UsersController();
