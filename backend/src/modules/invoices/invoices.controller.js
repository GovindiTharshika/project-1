/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/modules/invoices/invoices.controller.js
 * Description: Invoices Controller Layer
 * Handles endpoints for listing invoices, viewing single invoice line items,
 * and recording invoice payments.
 * ============================================================================
 */

// Import invoices business logic service
const invoicesService = require('./invoices.service');

class InvoicesController {
  /**
   * Handles GET /api/v1/invoices
   * Retrieves all invoices or customer-specific invoices
   * @param {object} req - HTTP request (contains req.user)
   * @param {object} res - HTTP response
   */
  async handleGetAll(req, res) {
    try {
      const data = await invoicesService.findAll(req.user);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, count: data.length, data }));
    } catch (err) {
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }

  /**
   * Handles GET /api/v1/invoices/:id
   * Retrieves single invoice by ID
   * @param {object} req - HTTP request (contains req.user)
   * @param {object} res - HTTP response
   * @param {string} id - Invoice ID from URL
   */
  async handleGetOne(req, res, id) {
    try {
      const data = await invoicesService.findOne(id, req.user);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data }));
    } catch (err) {
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }

  /**
   * Handles PATCH /api/v1/invoices/:id/pay
   * Marks invoice as settled / paid (Admin role required)
   * @param {object} req - HTTP request (contains req.user)
   * @param {object} res - HTTP response
   * @param {string} id - Invoice ID from URL
   */
  async handleMarkPaid(req, res, id) {
    try {
      const data = await invoicesService.markPaid(id, req.user);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data }));
    } catch (err) {
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }
}

// Export singleton instance of InvoicesController
module.exports = new InvoicesController();
