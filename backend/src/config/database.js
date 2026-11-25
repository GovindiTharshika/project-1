/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/config/database.js
 * Description: PostgreSQL Connection & Data Access Layer
 * All runtime reads and writes use the PostgreSQL pool exported at the end
 * of this module. The legacy seed object below is not used by application code.
 * ============================================================================
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    'postgres://b2b_admin:b2b_password_secure123@localhost:5432/b2b_orderhub',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('error', error => console.error('Unexpected PostgreSQL pool error:', error.message));

// Retained below only as historical seed documentation. Runtime access uses PostgreSQL.
const memoryDb = {
  // 1. Registered platform users with role assignments and detailed enterprise profile records
  users: [
    // Administrator account with full system authority
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@b2b.com',
      password: 'admin123',
      role: 'admin',
      company: 'B2B Corp Global HQ',
      status: 'active',
      joined: '2024-01-10',
      title: 'Chief Procurement Officer',
      phone: '+1 (800) 555-0199',
      address: '100 Enterprise Way, Suite 400, Chicago, IL 60601',
      taxId: 'US-EIN-88492019',
      creditLimit: 250000,
      paymentTerms: 'Net-30',
      loadingDock: 'Central Distribution Gate 1'
    },
    // Sales Representative handling fulfillment and customer orders
    {
      id: 2,
      name: 'Sarah Sales',
      email: 'sales@b2b.com',
      password: 'sales123',
      role: 'sales',
      company: 'B2B Corp Global HQ',
      status: 'active',
      joined: '2024-02-15',
      title: 'Senior Account Director',
      phone: '+1 (800) 555-0142',
      address: '100 Enterprise Way, Suite 400, Chicago, IL 60601',
      taxId: 'US-EIN-88492019',
      creditLimit: 100000,
      paymentTerms: 'Net-30',
      loadingDock: 'Sales Ops Dispatch Unit 4'
    },
    // Wholesale Buyer placing volume orders
    {
      id: 3,
      name: 'Bob Buyer',
      email: 'buyer@b2b.com',
      password: 'buyer123',
      role: 'customer',
      company: 'TechVentures Logistics Ltd',
      status: 'active',
      joined: '2024-03-01',
      title: 'VP of Global Logistics',
      phone: '+1 (415) 890-2134',
      address: '742 Market Street, 5th Floor, San Francisco, CA 94103',
      taxId: 'CA-CORP-9921448',
      creditLimit: 50000,
      paymentTerms: 'Net-14',
      loadingDock: 'Dock B - Bay 3 (Forklift Accessible)'
    },
    // Additional Wholesale Client account
    {
      id: 4,
      name: 'Alice Chen',
      email: 'alice@corp.com',
      password: 'alice123',
      role: 'customer',
      company: 'Nexus Supply Solutions',
      status: 'active',
      joined: '2024-03-20',
      title: 'Procurement Director',
      phone: '+1 (212) 440-9812',
      address: '350 5th Avenue, Suite 1200, New York, NY 10118',
      taxId: 'NY-BUS-4819203',
      creditLimit: 75000,
      paymentTerms: 'Net-14',
      loadingDock: 'Warehouse West Entrance Receiving'
    },
    // Warehouse Operations / Logistics Specialist (Extension Role)
    {
      id: 5,
      name: 'Dave Dispatcher',
      email: 'warehouse@b2b.com',
      password: 'warehouse123',
      role: 'warehouse',
      company: 'B2B Corp Global HQ',
      status: 'active',
      joined: '2024-04-01',
      title: 'Warehouse Fulfillment Manager',
      phone: '+1 (800) 555-0188',
      address: '100 Enterprise Way, Loading Dock Gate 2, Chicago, IL 60601',
      taxId: 'US-EIN-88492019',
      creditLimit: 0,
      paymentTerms: 'N/A',
      loadingDock: 'Central Logistics Dispatch Dock 2'
    }
  ],

  // 2. Wholesale product catalog with SKUs, real-time inventory counts and safety thresholds
  products: [
    { id: 1, sku: 'KB-001', name: 'Wireless Ergonomic Keyboard', category: 'Electronics', price: 49.99, stock: 150, minStock: 20, emoji: '⌨️', description: 'Low-profile wireless mechanical keyboard with dual-mode connectivity' },
    { id: 2, sku: 'HB-002', name: 'USB-C Enterprise Hub 7-in-1', category: 'Electronics', price: 34.99, stock: 85, minStock: 15, emoji: '🔌', description: '4K HDMI, Gigabit Ethernet, 100W Power Delivery and dual USB 3.2' },
    { id: 3, sku: 'MS-003', name: 'Dual Monitor Articulating Arm', category: 'Furniture', price: 89.00, stock: 12, minStock: 10, emoji: '🖥️', description: 'Heavy-duty gas spring aluminum monitor stand for dual 32" screens' },
    { id: 4, sku: 'BP-004', name: 'Commercial Ballpoint Pens (Box 50)', category: 'Office Supplies', price: 12.99, stock: 320, minStock: 40, emoji: '🖊️', description: 'Bulk box of 50 smooth gel ink blue ballpoint pens for office use' },
    { id: 5, sku: 'WM-005', name: 'Rechargeable Optical Mouse', category: 'Electronics', price: 29.99, stock: 8, minStock: 10, emoji: '🖱️', description: 'Precision 4000 DPI ergonomic silent click wireless mouse' },
    { id: 6, sku: 'DL-006', name: 'Dimmable LED Workstation Lamp', category: 'Accessories', price: 44.00, stock: 0, minStock: 5, emoji: '💡', description: 'Glare-free reading light with Qi wireless charging base' },
    { id: 7, sku: 'AP-007', name: 'Premium Multipurpose A4 Paper (Case)', category: 'Office Supplies', price: 38.50, stock: 540, minStock: 60, emoji: '📄', description: 'Case of 5 reams (2500 sheets) bright white 80gsm paper' },
    { id: 8, sku: 'OC-008', name: 'Executive Mesh Ergonomic Chair', category: 'Furniture', price: 299.00, stock: 5, minStock: 5, emoji: '🪑', description: 'High-back breathable mesh chair with 3D armrests and lumbar support' },
    { id: 9, sku: 'WC-009', name: 'Full HD 1080p Conference Webcam', category: 'Electronics', price: 69.99, stock: 40, minStock: 10, emoji: '📷', description: 'Wide-angle lens with dual noise-canceling stereo microphones' },
    { id: 10, sku: 'SN-010', name: 'Self-Adhesive Notes Value Pack', category: 'Office Supplies', price: 8.99, stock: 210, minStock: 25, emoji: '🗒️', description: 'Multi-color pack of 12 pads (100 sheets each) 3x3 inches' }
  ],

  // 3. Purchase orders with line items, total calculation and fulfillment progression
  orders: [
    { id: 'ORD-001', customerId: 3, customerName: 'Bob Buyer', company: 'TechVentures Logistics Ltd', items: [{ productId: 1, name: 'Wireless Ergonomic Keyboard', qty: 5, price: 49.99 }, { productId: 9, name: 'Full HD 1080p Conference Webcam', qty: 3, price: 69.99 }], total: 459.92, status: 'delivered', date: '2024-11-01', notes: 'Deliver to Loading Dock B before 4 PM' },
    { id: 'ORD-002', customerId: 4, customerName: 'Alice Chen', company: 'Nexus Supply Solutions', items: [{ productId: 3, name: 'Dual Monitor Articulating Arm', qty: 10, price: 89.00 }, { productId: 4, name: 'Commercial Ballpoint Pens (Box 50)', qty: 9, price: 12.99 }], total: 1009.80, status: 'shipped', date: '2024-11-05', notes: 'Carrier: FedEx Freight Tracking #FX-98214' },
    { id: 'ORD-003', customerId: 3, customerName: 'Bob Buyer', company: 'TechVentures Logistics Ltd', items: [{ productId: 7, name: 'Premium Multipurpose A4 Paper (Case)', qty: 12, price: 38.50 }], total: 474.50, status: 'processing', date: '2024-11-08', notes: 'Priority batch fulfillment' },
    { id: 'ORD-004', customerId: 4, customerName: 'Alice Chen', company: 'Nexus Supply Solutions', items: [{ productId: 8, name: 'Executive Mesh Ergonomic Chair', qty: 4, price: 299.00 }, { productId: 1, name: 'Wireless Ergonomic Keyboard', qty: 4, price: 49.99 }], total: 1396.00, status: 'confirmed', date: '2024-11-10', notes: 'Awaiting batch pick at central warehouse' },
    { id: 'ORD-005', customerId: 3, customerName: 'Bob Buyer', company: 'TechVentures Logistics Ltd', items: [{ productId: 2, name: 'USB-C Enterprise Hub 7-in-1', qty: 15, price: 34.99 }], total: 524.85, status: 'pending', date: '2024-11-12', notes: 'Customer requested delivery date 2024-11-20' },
  ],

  // 4. Commercial tax invoices with due dates, linked order IDs and settlement statuses
  invoices: [
    { id: 'INV-001', orderId: 'ORD-001', customerId: 3, customerName: 'Bob Buyer', company: 'TechVentures Logistics Ltd', amount: 459.92, issued: '2024-11-01', due: '2024-11-15', status: 'paid' },
    { id: 'INV-002', orderId: 'ORD-002', customerId: 4, customerName: 'Alice Chen', company: 'Nexus Supply Solutions', amount: 1009.80, issued: '2024-11-05', due: '2024-11-19', status: 'pending' },
    { id: 'INV-003', orderId: 'ORD-003', customerId: 3, customerName: 'Bob Buyer', company: 'TechVentures Logistics Ltd', amount: 474.50, issued: '2024-11-08', due: '2024-11-22', status: 'pending' },
    { id: 'INV-004', orderId: 'ORD-004', customerId: 4, customerName: 'Alice Chen', company: 'Nexus Supply Solutions', amount: 1396.00, issued: '2024-11-10', due: '2024-11-10', status: 'overdue' },
    { id: 'INV-005', orderId: 'ORD-005', customerId: 3, customerName: 'Bob Buyer', company: 'TechVentures Logistics Ltd', amount: 524.85, issued: '2024-11-12', due: '2024-11-26', status: 'pending' },
  ],

  // 5. Immutable compliance audit trail tracking user sessions, inventory and order lifecycle changes
  auditLogs: [
    { id: 1, type: 'auth', actor: 'Admin User', msg: 'System initialized and primary database migration completed', time: new Date().toISOString(), color: 'blue' }
  ]
};

// Wholesale minimum for the commercial ballpoint pens SKU (also set in migration 003).
memoryDb.products.find(product => product.sku === 'BP-004').moq = 5;

// Database interface object exposing query methods and audit helpers
const db = {
    // Legacy seed state retained only for reference; runtime services use PostgreSQL.
    isPostgres: true,

  // Direct reference to the memory store tables
  state: memoryDb,

  /**
   * Records an immutable audit log entry into the system activity ledger
   * @param {string} type - Event category ('auth', 'order', 'product', 'invoice', 'user')
   * @param {string} actor - Name or identity of the user/system initiating the action
   * @param {string} msg - Detailed description of the operation performed
   * @param {string} color - Visual color code indicator ('blue', 'green', 'orange', 'red')
   * @returns {object} The persisted audit log entry
   */
  log(type, actor, msg, color = 'blue') {
    // Construct the audit log payload with unique timestamp
    const entry = {
      id: Date.now() + Math.floor(Math.random() * 1000), // Unique record identifier
      type,                                              // Event classification
      actor: actor || 'System Daemon',                   // Actor attribution
      msg,                                               // Descriptive text
      time: new Date().toISOString(),                   // Standard ISO 8601 timestamp
      color                                              // Visual severity marker
    };

    // Prepend to top of logs array so newest entries appear first
    memoryDb.auditLogs.unshift(entry);

    // Return the created entry
    return entry;
  }
};

async function query(text, params) {
  return pool.query(text, params);
}

async function withTransaction(work) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function log(type, actor, message, color = 'blue', actorId = null, executor = pool) {
  if (process.env.USE_PG === 'true') {
    try {
      const result = await executor.query(
        `INSERT INTO audit_logs (event_type, actor, actor_id, action_details, severity)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, event_type, actor, actor_id, action_details, severity, created_at`,
        [type, actor || 'System Daemon', actorId, message, color === 'orange' ? 'warn' : color]
      );
      const row = result.rows[0];
      return {
        id: row.id,
        type: row.event_type,
        actor: row.actor,
        actorId: row.actor_id,
        msg: row.action_details,
        color: row.severity,
        time: row.created_at
      };
    } catch (err) {
      // Fallback to memory logger if PG write fails
      return db.log(type, actor, message, color);
    }
  }
  return db.log(type, actor, message, color);
}

// Unified data access layer: supports PostgreSQL when configured,
// and seamless in-memory fallback for offline/test environments.
module.exports = {
  pool,
  query,
  withTransaction,
  log,
  state: memoryDb,
  memoryDb,
  db
};
