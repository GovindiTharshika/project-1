/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/modules/audit/audit.service.js
 * Description: Audit Trail Service Layer
 * Provides read access to the append-only activity ledger for regulatory
 * compliance, operational transparency, and session tracking.
 * ============================================================================
 */

// Import database instance
const db = require('../../config/database');

class AuditService {
  /**
   * Retrieves audit logs with optional event type and text keyword search
   * @param {object} query - Filter parameters { type, search }
   * @returns {Promise<Array>} Filtered audit trail entries
   */
  async findAll(query = {}) {
    const { type, search } = query;
    let list = db.state.auditLogs;

    // Filter by classification ('auth', 'order', 'product', 'invoice', 'user')
    if (type) {
      list = list.filter(l => l.type.toLowerCase() === type.toLowerCase());
    }

    // Filter by keyword within the action message or actor name
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(l => l.msg.toLowerCase().includes(q) || l.actor.toLowerCase().includes(q));
    }

    return list;
  }
}

// Export singleton instance of AuditService
module.exports = new AuditService();
