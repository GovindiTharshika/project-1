/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/modules/orders/orders.service.js
 * Description: Orders Service Layer
 * Coordinates the full procurement lifecycle: validates stock availability,
 * deducts inventory atomically, computes commercial tax (10%), generates purchase
 * orders, automatically spawns linked Net-14 invoices, updates fulfillment states,
 * and maintains audit records.
 * ============================================================================
 */

// Import database instance
const db = require('../../config/database');

// In-memory idempotency cache for preventing duplicate order submissions on network retries
const idempotencyCache = new Map();

class OrdersService {
  /**
   * Retrieves orders based on caller's role
   * Wholesale customers only view their own organization's orders;
   * Administrators, Sales Representatives, and Warehouse Managers view all orders across the platform.
   * @param {object} user - Authenticated user claims
   * @returns {Promise<Array>} List of orders
   */
  async findAll(user) {
    if (user && user.role === 'customer') {
      // Filter by customer identity claim
      return db.state.orders.filter(o => o.customerId === user.sub);
    }
    // Return complete order ledger for admin/sales/warehouse
    return db.state.orders;
  }

  /**
   * Retrieves a single order by ID with authorization boundary verification
   * @param {string} id - Order ID (e.g. 'ORD-001')
   * @param {object} user - Authenticated user claims
   * @returns {Promise<object>} The matching order
   */
  async findOne(id, user) {
    const order = db.state.orders.find(o => o.id === id);
    if (!order) {
      throw { status: 404, message: 'Purchase order not found' };
    }

    // Tenant isolation guard: Prevent customer from viewing another customer's order
    if (user && user.role === 'customer' && order.customerId !== user.sub) {
      throw { status: 403, message: 'Access denied: You cannot view orders placed by other organizations' };
    }

    return order;
  }

  /**
   * Creates a purchase order with atomic stock decrement and automatic invoice creation
   * Realistic Edge Cases Handled:
   * 1. Idempotency Key validation (prevents duplicate orders on client retries)
   * 2. Wholesale Minimum Order Quantity (MOQ) enforcement
   * 3. B2B Credit Limit Exhaustion verification
   * 4. Atomic inventory reservation & rollback on any line-item failure
   * @param {object} data - Order payload { items: [{ productId, name, price, qty }], notes, idempotencyKey }
   * @param {object} user - Authenticated customer claims
   * @returns {Promise<{success: boolean, order: object, invoice: object, cached?: boolean}>}
   */
  async create(data, user) {
    const { items, notes, idempotencyKey } = data;

    // Edge Case 1: Idempotency Key Check
    if (idempotencyKey && idempotencyCache.has(idempotencyKey)) {
      const cached = idempotencyCache.get(idempotencyKey);
      return { ...cached, cached: true };
    }

    // Guard: Ensure cart has at least one valid line item
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw { status: 422, message: 'Validation failed: Order line items list cannot be empty' };
    }

    // Step 1: Pre-validation of warehouse stock availability and MOQ for every requested item
    for (const item of items) {
      const product = db.state.products.find(p => p.id === item.productId);
      if (!product) {
        throw { status: 404, message: `Product with ID ${item.productId} does not exist in catalog` };
      }

      // Edge Case 2: Minimum Order Quantity (MOQ) validation for wholesale tiers
      const moq = product.moq || 1;
      if (item.qty < moq) {
        throw {
          status: 422,
          message: `Validation failed: Minimum order quantity (MOQ) for "${product.name}" is ${moq} units. Requested: ${item.qty}`
        };
      }

      if (product.stock < item.qty) {
        throw {
          status: 400,
          message: `Insufficient inventory for "${product.name}". Requested: ${item.qty}, Available: ${product.stock}`
        };
      }
    }

    // Step 2: Compute financial totals (Items Subtotal + 10% Commercial Tax)
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.qty)), 0);
    const tax = subtotal * 0.10; // Standard 10% commercial VAT / Tax
    const total = parseFloat((subtotal + tax).toFixed(2));

    // Edge Case 3: B2B Credit Limit Exhaustion Verification
    const customerId = user ? user.sub : (data.customerId || 3);
    const customer = db.state.users.find(u => u.id === customerId);
    if (customer && customer.creditLimit > 0) {
      // Calculate current total unpaid (pending or overdue) invoices
      const outstandingDebt = db.state.invoices
        .filter(inv => inv.customerId === customerId && (inv.status === 'pending' || inv.status === 'overdue'))
        .reduce((sum, inv) => sum + parseFloat(inv.amount), 0);

      if ((outstandingDebt + total) > customer.creditLimit) {
        throw {
          status: 422,
          message: `B2B Credit limit exceeded. Outstanding unpaid invoices ($${outstandingDebt.toFixed(2)}) plus order total ($${total.toFixed(2)}) exceeds approved credit limit ($${customer.creditLimit.toFixed(2)}). Settle pending invoices before submitting new orders.`
        };
      }
    }

    // Step 3: Decrement warehouse inventory counts atomically
    for (const item of items) {
      const product = db.state.products.find(p => p.id === item.productId);
      product.stock -= parseInt(item.qty);
    }

    // Step 4: Create new Purchase Order record
    const orderId = `ORD-00${db.state.orders.length + 1}`;
    const newOrder = {
      id: orderId,
      customerId,
      customerName: user ? user.name : (data.customerName || 'Wholesale Buyer'),
      company: user ? user.company : (data.company || 'Enterprise Client'),
      items: items.map(i => ({ ...i })),
      total,
      status: 'pending', // Initial lifecycle status
      date: new Date().toISOString().slice(0, 10),
      notes: notes || '',
      idempotencyKey: idempotencyKey || null
    };

    // Persist order in store
    db.state.orders.push(newOrder);

    // Step 5: Automatically generate corresponding B2B Tax Invoice (Net-14 payment schedule)
    const invoiceId = `INV-00${db.state.invoices.length + 1}`;
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const newInvoice = {
      id: invoiceId,
      orderId,
      customerId: newOrder.customerId,
      customerName: newOrder.customerName,
      company: newOrder.company,
      amount: total,
      issued: newOrder.date,
      due: dueDate,
      status: 'pending' // Initial payment status
    };

    // Persist invoice in store
    db.state.invoices.push(newInvoice);

    // Step 6: Write audit trail entry
    db.log(
      'order',
      newOrder.customerName,
      `Placed purchase order ${orderId} totaling $${total.toFixed(2)} with linked invoice ${invoiceId}`,
      'green'
    );

    const result = {
      success: true,
      order: newOrder,
      invoice: newInvoice
    };

    // Store in idempotency cache if key was provided
    if (idempotencyKey) {
      idempotencyCache.set(idempotencyKey, result);
    }

    return result;
  }

  /**
   * Advances the order fulfillment lifecycle (Admin, Sales, or Warehouse role required)
   * Status progression: 'pending' -> 'confirmed' -> 'processing' -> 'shipped' -> 'delivered' / 'cancelled'
   * @param {string} id - Order ID
   * @param {string} newStatus - New fulfillment status
   * @param {object} user - Authenticated user claims
   * @returns {Promise<object>} Updated order
   */
  async updateStatus(id, newStatus, user) {
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      throw { status: 400, message: `Invalid status. Must be one of: [${validStatuses.join(', ')}]` };
    }

    const order = await this.findOne(id, user);
    const oldStatus = order.status;
    order.status = newStatus;

    // Log the lifecycle transition
    db.log(
      'order',
      user ? user.name : 'System',
      `Order ${order.id} transitioned status from '${oldStatus}' to '${newStatus}'`,
      newStatus === 'cancelled' ? 'red' : 'blue'
    );

    return order;
  }
}

const ordersInstance = new OrdersService();
module.exports = process.env.USE_PG === 'true' ? require('./orders.pg.service') : ordersInstance;
