/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/modules/auth/auth.service.js
 * Description: Authentication Service Layer
 * Encapsulates credential validation, user registration, JWT token generation,
 * and session audit logging.
 * ============================================================================
 */

// Import shared database access layer
const db = require('../../config/database');

// Import JWT signing engine for issuing RFC 7519 HMAC-SHA256 tokens
const { sign } = require('../../config/jwt');

class AuthService {
  /**
   * Authenticates user credentials and issues a signed JWT token
   * @param {string} email - Registered user email address
   * @param {string} password - Raw user password
   * @returns {Promise<{token: string, user: object}>}
   */
  async login(email, password) {
    // Validate that both email and password are provided
    if (!email || !password) {
      throw { status: 400, message: 'Email and password are required' };
    }

    // Lookup user in relational user store by case-insensitive email match
    const user = db.state.users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    // Guard: Reject if no user matches credentials
    if (!user) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    // Guard: Prevent deactivated or suspended accounts from signing in
    if (user.status !== 'active') {
      throw { status: 403, message: 'Account is deactivated. Please contact your system administrator.' };
    }

    // Issue signed JWT token containing user identity and role claims
    const token = sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      company: user.company,
      name: user.name
    });

    // Record login event in system audit trail
    db.log('auth', user.name, `User ${user.email} signed in via JWT authentication`, 'blue');

    // Return token and sanitized user profile with complete enterprise metadata
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        title: user.title || 'Procurement Executive',
        phone: user.phone || '',
        address: user.address || '',
        taxId: user.taxId || '',
        creditLimit: user.creditLimit || 50000,
        paymentTerms: user.paymentTerms || 'Net-14',
        loadingDock: user.loadingDock || '',
        joined: user.joined || ''
      }
    };
  }

  /**
   * Registers a new wholesale buyer or sales representative account
   * @param {object} data - Registration payload (name, email, company, role, password)
   * @returns {Promise<{token: string, user: object}>}
   */
  async register(data) {
    const { name, email, company, role, password } = data;

    // Validate required registration parameters
    if (!name || !email || !company || !password) {
      throw { status: 400, message: 'Missing required registration fields' };
    }

    // Enforce uniqueness constraint on email address
    const existing = db.state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw { status: 409, message: 'An account with this email address already exists' };
    }

    // Instantiate new user entity with active status and current date
    const newUser = {
      id: db.state.users.length + 1,
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'customer',
      company,
      status: 'active',
      joined: new Date().toISOString().slice(0, 10)
    };

    // Persist new user entity
    db.state.users.push(newUser);

    // Record registration in audit trail
    db.log('user', newUser.name, `New user ${newUser.email} registered with role '${newUser.role}'`, 'blue');

    // Generate immediate JWT session token for automatic onboarding
    const token = sign({
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
      company: newUser.company,
      name: newUser.name
    });

    return {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        company: newUser.company
      }
    };
  }

  /**
   * Fetches the complete enriched profile of the authenticated user
   * @param {number} userId - ID of authenticated user
   * @returns {Promise<object>} Complete user profile object
   */
  async getProfile(userId) {
    const user = db.state.users.find(u => u.id === Number(userId));
    if (!user) {
      throw { status: 404, message: 'User account not found' };
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      title: user.title || 'Procurement Executive',
      phone: user.phone || '',
      address: user.address || '',
      taxId: user.taxId || '',
      creditLimit: user.creditLimit || 50000,
      paymentTerms: user.paymentTerms || 'Net-14',
      loadingDock: user.loadingDock || '',
      status: user.status,
      joined: user.joined
    };
  }

  /**
   * Updates authenticated user profile details
   * @param {number} userId - ID of authenticated user
   * @param {object} updates - Fields to update (name, company, phone, address, title, taxId, loadingDock)
   * @returns {Promise<object>} Sanitized updated user profile
   */
  async updateProfile(userId, updates) {
    const user = db.state.users.find(u => u.id === Number(userId));
    if (!user) {
      throw { status: 404, message: 'User account not found' };
    }

    if (updates.name) user.name = updates.name.trim();
    if (updates.company) user.company = updates.company.trim();
    if (updates.phone) user.phone = updates.phone.trim();
    if (updates.address) user.address = updates.address.trim();
    if (updates.title) user.title = updates.title.trim();
    if (updates.taxId) user.taxId = updates.taxId.trim();
    if (updates.loadingDock) user.loadingDock = updates.loadingDock.trim();

    db.log('user', user.name, `User ${user.email} updated profile details`, 'blue');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      title: user.title || '',
      phone: user.phone || '',
      address: user.address || '',
      taxId: user.taxId || '',
      creditLimit: user.creditLimit || 50000,
      paymentTerms: user.paymentTerms || 'Net-14',
      loadingDock: user.loadingDock || '',
      status: user.status,
      joined: user.joined
    };
  }

  /**
   * Updates authenticated user password
   * @param {number} userId - ID of authenticated user
   * @param {string} currentPassword - Current password for verification
   * @param {string} newPassword - New password to set
   * @returns {Promise<{message: string}>}
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = db.state.users.find(u => u.id === Number(userId));
    if (!user) {
      throw { status: 404, message: 'User account not found' };
    }

    if (user.password !== currentPassword) {
      throw { status: 400, message: 'Current password does not match' };
    }

    if (!newPassword || newPassword.length < 6) {
      throw { status: 400, message: 'New password must be at least 6 characters long' };
    }

    user.password = newPassword;
    db.log('auth', user.name, `User ${user.email} successfully updated account password`, 'blue');

    return { message: 'Password updated successfully' };
  }
}

const authInstance = new AuthService();
module.exports = process.env.USE_PG === 'true' ? require('./auth.pg.service') : authInstance;
