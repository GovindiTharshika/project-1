const bcrypt = require('bcryptjs');
const db = require('../../config/database');
const { sign } = require('../../config/jwt');

function profile(row) {
  return {
    id: row.id, name: row.name, email: row.email, role: row.role, company: row.company,
    title: row.title || 'Procurement Executive', phone: row.phone || '', address: row.address || '',
    taxId: row.tax_id || '', creditLimit: Number(row.credit_limit || 50000),
    paymentTerms: row.payment_terms || 'Net-14', loadingDock: row.loading_dock || '',
    joined: row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : '', status: row.status
  };
}

function tokenFor(row) {
  return sign({ sub: row.id, email: row.email, role: row.role, company: row.company, name: row.name });
}

class AuthPostgresService {
  async findUserById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [Number(id)]);
    return result.rows[0];
  }

  async login(email, password) {
    if (!email || !password) throw { status: 400, message: 'Email and password are required' };
    const result = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) throw { status: 401, message: 'Invalid email or password' };
    if (user.status !== 'active') throw { status: 403, message: 'Account is deactivated. Please contact your system administrator.' };
    await db.log('auth', user.name, `User ${user.email} signed in via JWT authentication`, 'blue', user.id);
    return { token: tokenFor(user), user: profile(user) };
  }

  async register(data) {
    const { name, email, company, role, password } = data;
    if (!name || !email || !company || !password) throw { status: 400, message: 'Missing required registration fields' };
    if (password.length < 6) throw { status: 422, message: 'Password must be at least 6 characters long' };
    const passwordHash = await bcrypt.hash(password, 10);
    try {
      const result = await db.query(`INSERT INTO users (name, email, password_hash, role, company, status)
        VALUES ($1,$2,$3,$4,$5,'active') RETURNING *`, [name.trim(), email.toLowerCase(), passwordHash, role || 'customer', company.trim()]);
      const user = result.rows[0];
      await db.log('user', user.name, `New user ${user.email} registered with role '${user.role}'`, 'blue', user.id);
      return { token: tokenFor(user), user: profile(user) };
    } catch (error) {
      if (error.code === '23505') throw { status: 409, message: 'An account with this email address already exists' };
      if (error.code === '23514') throw { status: 422, message: 'Invalid user role' };
      throw error;
    }
  }

  async getProfile(userId) {
    const user = await this.findUserById(userId);
    if (!user) throw { status: 404, message: 'User account not found' };
    return profile(user);
  }

  async updateProfile(userId, updates) {
    const result = await db.query(`UPDATE users SET
      name = COALESCE(NULLIF($1, ''), name), company = COALESCE(NULLIF($2, ''), company),
      phone = COALESCE(NULLIF($3, ''), phone), address = COALESCE(NULLIF($4, ''), address),
      title = COALESCE(NULLIF($5, ''), title), tax_id = COALESCE(NULLIF($6, ''), tax_id),
      loading_dock = COALESCE(NULLIF($7, ''), loading_dock), updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 RETURNING *`, [updates.name?.trim(), updates.company?.trim(), updates.phone?.trim(), updates.address?.trim(), updates.title?.trim(), updates.taxId?.trim(), updates.loadingDock?.trim(), Number(userId)]);
    if (!result.rows[0]) throw { status: 404, message: 'User account not found' };
    const user = result.rows[0];
    await db.log('user', user.name, `User ${user.email} updated profile details`, 'blue', user.id);
    return profile(user);
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.findUserById(userId);
    if (!user) throw { status: 404, message: 'User account not found' };
    if (!(await bcrypt.compare(currentPassword || '', user.password_hash))) throw { status: 400, message: 'Current password does not match' };
    if (!newPassword || newPassword.length < 6) throw { status: 400, message: 'New password must be at least 6 characters long' };
    await db.query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [await bcrypt.hash(newPassword, 10), user.id]);
    await db.log('auth', user.name, `User ${user.email} successfully updated account password`, 'blue', user.id);
    return { message: 'Password updated successfully' };
  }
}

module.exports = new AuthPostgresService();
