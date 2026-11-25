const db = require('../../config/database');

function sanitize(row) {
  const { password_hash, ...user } = row;
  return {
    ...user,
    taxId: user.tax_id || '',
    creditLimit: Number(user.credit_limit || 50000),
    paymentTerms: user.payment_terms || 'Net-14',
    loadingDock: user.loading_dock || '',
    joined: user.created_at ? new Date(user.created_at).toISOString().slice(0, 10) : ''
  };
}

class UsersPostgresService {
  async findAll() {
    const result = await db.query('SELECT * FROM users ORDER BY id');
    return result.rows.map(sanitize);
  }

  async toggleStatus(id, user) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [parseInt(id)]);
    const target = result.rows[0];
    if (!target) throw { status: 404, message: 'User account not found' };
    if (user && Number(user.sub) === target.id) throw { status: 400, message: 'Administrators cannot deactivate their own active account' };
    const nextStatus = target.status === 'active' ? 'inactive' : 'active';
    const updated = await db.query('UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [nextStatus, target.id]);
    await db.log('user', user ? user.name : 'Administrator', `Account ${target.email} status changed to '${nextStatus}'`, nextStatus === 'active' ? 'green' : 'orange', user && user.sub);
    return sanitize(updated.rows[0]);
  }
}

module.exports = new UsersPostgresService();
