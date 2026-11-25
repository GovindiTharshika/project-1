const db = require('../../config/database');

const columns = 'id, sku, name, category, description, price, stock_quantity AS stock, min_stock_level AS "minStock", min_order_quantity AS "minOrderQuantity", emoji';

class ProductsPostgresService {
  async findAll({ category, search, stockStatus } = {}) {
    const conditions = [];
    const values = [];
    if (category) { values.push(category); conditions.push(`LOWER(category) = LOWER($${values.length})`); }
    if (search) { values.push(`%${search}%`); conditions.push(`(name ILIKE $${values.length} OR sku ILIKE $${values.length})`); }
    if (stockStatus === 'in') conditions.push('stock_quantity > min_stock_level');
    if (stockStatus === 'low') conditions.push('stock_quantity > 0 AND stock_quantity <= min_stock_level');
    if (stockStatus === 'out') conditions.push('stock_quantity = 0');
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await db.query(`SELECT ${columns} FROM products ${where} ORDER BY id`, values);
    return result.rows;
  }

  async findOne(id) {
    const result = await db.query(`SELECT ${columns} FROM products WHERE id = $1`, [parseInt(id)]);
    if (!result.rows[0]) throw { status: 404, message: 'Product not found in catalog' };
    return result.rows[0];
  }

  async create(data, user) {
    const { name, sku, category, price, stock, minStock, emoji, description } = data;
    if (!name || !sku || price === undefined) throw { status: 422, message: 'Validation failed: name, sku, and price are required fields' };
    if (Number.isNaN(Number(price)) || Number(price) < 0) throw { status: 422, message: 'Validation failed: price must be a non-negative number' };
    try {
      const result = await db.query(`INSERT INTO products (sku, name, category, description, price, stock_quantity, min_stock_level, emoji)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING ${columns}`,
        [sku.toUpperCase(), name, category || 'General', description || '', Number(price), parseInt(stock) || 0, parseInt(minStock) || 5, emoji || '📦']);
      const product = result.rows[0];
      await db.log('product', user ? user.name : 'Admin', `Created new catalog product "${name}" (SKU: ${sku})`, 'blue', user && user.sub);
      return product;
    } catch (error) {
      if (error.code === '23505') throw { status: 409, message: `A product with SKU '${sku}' already exists` };
      throw error;
    }
  }

  async updateStock(id, newStock, user) {
    const parsedStock = Number(newStock);
    if (!Number.isInteger(parsedStock) || parsedStock < 0) throw { status: 400, message: 'Stock quantity must be a non-negative integer' };
    const oldResult = await db.query('SELECT name, stock_quantity FROM products WHERE id = $1', [parseInt(id)]);
    if (!oldResult.rows[0]) throw { status: 404, message: 'Product not found in catalog' };
    const result = await db.query(`UPDATE products SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING ${columns}`, [parsedStock, parseInt(id)]);
    const item = result.rows[0];
    await db.log('product', user ? user.name : 'System', `Updated stock for "${item.name}" from ${oldResult.rows[0].stock_quantity} to ${parsedStock} units`, parsedStock === 0 ? 'orange' : 'blue', user && user.sub);
    return item;
  }
}

module.exports = new ProductsPostgresService();
