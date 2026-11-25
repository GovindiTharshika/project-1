const db = require('../../config/database');

const invoiceSelect = `SELECT i.id, i.order_id AS "orderId", i.customer_id AS "customerId",
  u.name AS "customerName", u.company, i.amount, i.issue_date AS issued,
  i.due_date AS due, i.status, i.paid_at AS "paidAt"
  FROM invoices i JOIN users u ON u.id = i.customer_id`;

class InvoicesPostgresService {
  async findAll(user) {
    const values = [];
    let where = '';
    if (user && user.role === 'customer') { values.push(Number(user.sub)); where = ' WHERE i.customer_id = $1'; }
    const result = await db.query(`${invoiceSelect}${where} ORDER BY i.issue_date DESC, i.id`, values);
    return result.rows;
  }

  async findOne(id, user) {
    const values = [id];
    let where = ' WHERE i.id = $1';
    if (user && user.role === 'customer') { values.push(Number(user.sub)); where += ' AND i.customer_id = $2'; }
    const result = await db.query(`${invoiceSelect}${where}`, values);
    const invoice = result.rows[0];
    if (!invoice) throw { status: 404, message: 'Invoice not found' };
    return invoice;
  }

  async markPaid(id, user) {
    const invoice = await this.findOne(id, user);
    if (invoice.status === 'paid') return invoice;
    await db.query("UPDATE invoices SET status = 'paid', paid_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);
    await db.log('invoice', user ? user.name : 'Administrator', `Invoice ${id} for $${Number(invoice.amount).toFixed(2)} marked as PAID`, 'green', user && user.sub);
    return this.findOne(id, user);
  }
}

module.exports = new InvoicesPostgresService();
