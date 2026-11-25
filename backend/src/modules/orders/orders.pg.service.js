const db = require('../../config/database');

const orderSelect = `SELECT o.id, o.customer_id AS "customerId", u.name AS "customerName", u.company,
  o.total_amount AS total, o.status, o.order_date AS date, o.notes,
  COALESCE((SELECT json_agg(json_build_object('productId', oi.product_id, 'name', oi.product_name,
    'price', oi.unit_price, 'qty', oi.quantity, 'subtotal', oi.subtotal) ORDER BY oi.id)
    FROM order_items oi WHERE oi.order_id = o.id), '[]'::json) AS items
  FROM orders o JOIN users u ON u.id = o.customer_id`;

class OrdersPostgresService {
  async findAll(user) {
    const values = [];
    let where = '';
    if (user && user.role === 'customer') { values.push(Number(user.sub)); where = ' WHERE o.customer_id = $1'; }
    const result = await db.query(`${orderSelect}${where} ORDER BY o.order_date DESC, o.created_at DESC`, values);
    return result.rows;
  }

  async findOne(id, user) {
    const values = [id];
    let where = ' WHERE o.id = $1';
    if (user && user.role === 'customer') { values.push(Number(user.sub)); where += ' AND o.customer_id = $2'; }
    const result = await db.query(`${orderSelect}${where}`, values);
    if (!result.rows[0]) throw { status: 404, message: 'Purchase order not found' };
    return result.rows[0];
  }

  async create(data, user) {
    const { items, notes } = data;
    if (!Array.isArray(items) || items.length === 0) throw { status: 422, message: 'Validation failed: Order line items list cannot be empty' };
    const customerId = Number(user && user.sub);
    if (!customerId) throw { status: 401, message: 'Authenticated customer is required' };

    return db.withTransaction(async client => {
      const lockedProducts = [];
      for (const item of items) {
        const qty = Number(item.qty);
        if (!Number.isInteger(qty) || qty <= 0) throw { status: 422, message: 'Each order quantity must be a positive integer' };
        const result = await client.query('SELECT id, name, price, stock_quantity, min_order_quantity FROM products WHERE id = $1 FOR UPDATE', [Number(item.productId)]);
        const product = result.rows[0];
        if (!product) throw { status: 404, message: `Product with ID ${item.productId} does not exist in catalog` };
        if (qty < product.min_order_quantity) throw { status: 422, message: `Minimum order quantity for "${product.name}" is ${product.min_order_quantity} units. Requested: ${qty}` };
        if (product.stock_quantity < qty) throw { status: 400, message: `Insufficient inventory for "${product.name}". Requested: ${qty}, Available: ${product.stock_quantity}` };
        lockedProducts.push({ ...product, qty });
      }

      const subtotal = lockedProducts.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
      const total = Number((subtotal * 1.10).toFixed(2));
      const orderId = `ORD-${Date.now()}`;
      const invoiceId = `INV-${Date.now()}`;
      const customerResult = await client.query('SELECT name, company FROM users WHERE id = $1', [customerId]);
      const customer = customerResult.rows[0];
      if (!customer) throw { status: 404, message: 'Customer account not found' };

      await client.query(`INSERT INTO orders (id, customer_id, total_amount, status, notes)
        VALUES ($1, $2, $3, 'pending', $4)`, [orderId, customerId, total, notes || '']);
      for (const item of lockedProducts) {
        await client.query(`INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal)
          VALUES ($1,$2,$3,$4,$5,$6)`, [orderId, item.id, item.name, item.price, item.qty, Number(item.price) * item.qty]);
        await client.query('UPDATE products SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [item.qty, item.id]);
      }
      await client.query(`INSERT INTO invoices (id, order_id, customer_id, amount, due_date, status)
        VALUES ($1,$2,$3,$4,CURRENT_DATE + INTERVAL '14 days','pending')`, [invoiceId, orderId, customerId, total]);
      await db.log('order', customer.name, `Placed purchase order ${orderId} totaling $${total.toFixed(2)} with linked invoice ${invoiceId}`, 'green', customerId, client);

      const order = {
        id: orderId,
        customerId,
        customerName: customer.name,
        company: customer.company,
        items: lockedProducts.map(item => ({ productId: item.id, name: item.name, price: Number(item.price), qty: item.qty, subtotal: Number(item.price) * item.qty })),
        total,
        status: 'pending',
        date: new Date().toISOString().slice(0, 10),
        notes: notes || ''
      };
      const invoice = (await client.query(`SELECT i.id, i.order_id AS "orderId", i.customer_id AS "customerId", u.name AS "customerName", u.company, i.amount, i.issue_date AS issued, i.due_date AS due, i.status, i.paid_at AS "paidAt" FROM invoices i JOIN users u ON u.id = i.customer_id WHERE i.id = $1`, [invoiceId])).rows[0];
      return { success: true, order, invoice };
    });
  }

  async updateStatus(id, newStatus, user) {
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(newStatus)) throw { status: 400, message: `Invalid status. Must be one of: [${validStatuses.join(', ')}]` };
    const existing = await this.findOne(id, user);
    const result = await db.query('UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING status', [newStatus, id]);
    await db.log('order', user ? user.name : 'System', `Order ${id} transitioned status from '${existing.status}' to '${newStatus}'`, newStatus === 'cancelled' ? 'red' : 'blue', user && user.sub);
    return this.findOne(id, user);
  }
}

module.exports = new OrdersPostgresService();
