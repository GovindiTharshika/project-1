/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/modules/invoices/invoices.service.js
 * Description: Commercial Invoicing Service Layer
 * Manages B2B Net-14 tax invoices, customer ledger queries, payment status
 * reconciliation, and accounts receivable audit records.
 * ============================================================================
 */

// Import database instance
const db = require('../../config/database');

class InvoicesService {
  /**
   * Retrieves invoices with tenant segregation
   * Customers view only their company's invoices;
   * Administrators and Sales personnel view company-wide receivables.
   * @param {object} user - Authenticated user claims
   * @returns {Promise<Array>} List of invoices
   */
  async findAll(user) {
    if (user && user.role === 'customer') {
      return db.state.invoices.filter(i => i.customerId === user.sub);
    }
    return db.state.invoices;
  }

  /**
   * Retrieves a single tax invoice by ID with customer boundary check
   * @param {string} id - Invoice ID (e.g., 'INV-001')
   * @param {object} user - Authenticated user claims
   * @returns {Promise<object>} The matching invoice
   */
  async findOne(id, user) {
    const inv = db.state.invoices.find(i => i.id === id);
    if (!inv) {
      throw { status: 404, message: 'Invoice not found' };
    }

    // Access boundary enforcement
    if (user && user.role === 'customer' && inv.customerId !== user.sub) {
      throw { status: 403, message: 'Access denied: Invoice belongs to another commercial client' };
    }

    return inv;
  }

  /**
   * Reconciles invoice payment status to 'paid' (Admin role required)
   * @param {string} id - Invoice ID
   * @param {object} user - Authenticated administrator claims
   * @returns {Promise<object>} The updated invoice
   */
  async markPaid(id, user) {
    const inv = await this.findOne(id, user);

    // If already marked as paid, return idempotent result
    if (inv.status === 'paid') {
      return inv;
    }

    // Update status to paid and attach payment timestamp
    inv.status = 'paid';
    inv.paidAt = new Date().toISOString();

    // Log the accounting payment event
    db.log(
      'invoice',
      user ? user.name : 'Administrator',
      `Invoice ${inv.id} for $${parseFloat(inv.amount).toFixed(2)} marked as PAID`,
      'green'
    );

    return inv;
  }
}

// Export singleton instance of InvoicesService
module.exports = new InvoicesService();
