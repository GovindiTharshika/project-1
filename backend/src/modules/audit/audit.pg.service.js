const db = require('../../config/database');

class AuditPostgresService {
  async findAll({ type, search } = {}) {
    const conditions = [];
    const values = [];
    if (type) { values.push(type); conditions.push(`LOWER(event_type) = LOWER($${values.length})`); }
    if (search) { values.push(`%${search}%`); conditions.push(`(actor ILIKE $${values.length} OR action_details ILIKE $${values.length})`); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await db.query(`SELECT id, event_type AS type, actor, actor_id AS "actorId", action_details AS msg, severity AS color, created_at AS time FROM audit_logs ${where} ORDER BY created_at DESC, id DESC`, values);
    return result.rows;
  }
}

module.exports = new AuditPostgresService();
