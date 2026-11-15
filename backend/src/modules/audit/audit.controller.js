/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/modules/audit/audit.controller.js
 * Description: Audit Trail Controller Layer
 * Handles queries against the immutable audit log ledger (Admin/Sales only).
 * ============================================================================
 */

// Import audit business logic service
const auditService = require('./audit.service');

class AuditController {
  /**
   * Handles GET /api/v1/audit
   * Retrieves audit logs filtered by event type or search keyword
   * @param {object} req - HTTP request
   * @param {object} res - HTTP response
   * @param {object} query - URL parameters { type, search }
   */
  async handleGetAll(req, res, query) {
    try {
      const data = await auditService.findAll(query);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, count: data.length, data }));
    } catch (err) {
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }
}

// Export singleton instance of AuditController
module.exports = new AuditController();
