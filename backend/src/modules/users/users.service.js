/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/modules/users/users.service.js
 * Description: Users & Privileges Service Layer
 * Administrative management of accounts, organization profiles, and status
 * activation/deactivation controls.
 * ============================================================================
 */

// Import database instance
const db = require('../../config/database');

class UsersService {
  /**
   * Retrieves all registered accounts with credentials sanitized
   * @returns {Promise<Array>} List of user objects without password hashes
   */
  async findAll() {
    // Strip password field before returning user entity
    return db.state.users.map(({ password, ...u }) => u);
  }

  /**
   * Toggles user account status between 'active' and 'inactive' (Admin only)
   * @param {number|string} id - Target user ID
   * @param {object} user - Authenticated administrator claims
   * @returns {Promise<object>} Updated sanitized user profile
   */
  async toggleStatus(id, user) {
    const target = db.state.users.find(u => u.id === parseInt(id));
    if (!target) {
      throw { status: 404, message: 'User account not found' };
    }

    // Safety guard: Prevent administrators from deactivating their own active account
    if (user && (user.sub === target.id || user.id === target.id)) {
      throw { status: 400, message: 'Administrators cannot deactivate their own active account' };
    }

    // Toggle status
    target.status = target.status === 'active' ? 'inactive' : 'active';

    // Log the administrative action in audit trail
    db.log(
      'user',
      user ? user.name : 'Administrator',
      `Account ${target.email} status changed to '${target.status}'`,
      target.status === 'active' ? 'green' : 'orange'
    );

    // Return sanitized object without password
    const { password, ...sanitized } = target;
    return sanitized;
  }
}

// Export singleton instance of UsersService
module.exports = new UsersService();
