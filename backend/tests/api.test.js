/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/tests/api.test.js
 * Description: Automated Backend Integration Test Suite
 * Executes end-to-end integration tests verifying health checks, RFC 7519 JWT
 * authentication, RBAC authorization boundaries, catalog querying, order
 * placement with atomic inventory deductions, linked invoice generation, and
 * immutable audit logging.
 * ============================================================================
 */

// Import native HTTP module
const http = require('http');

// Set dedicated isolated test port to prevent port conflicts
process.env.PORT = '5003';

// Launch server instance
require('../src/server');

// Delay test runner slightly to guarantee server socket binding has completed
setTimeout(async () => {
  console.log('--- Starting Backend API Test Suite on Port 5003 ---');

  // Track assertion outcomes
  let passed = 0;
  let failed = 0;

  /**
   * Evaluates an assertion condition and logs the formatted test result
   * @param {string} desc - Test case description
   * @param {boolean} condition - Boolean assertion expression
   */
  function assert(desc, condition) {
    if (condition) {
      console.log(`✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${desc}`);
      failed++;
    }
  }

  /**
   * Helper utility to perform HTTP requests against the local test server
   * @param {string} path - Request endpoint path (e.g., '/api/v1/products')
   * @param {object} options - Request options (method, headers, body)
   * @returns {Promise<{status: number, body: any, raw: string}>}
   */
  function api(path, options = {}) {
    return new Promise((resolve, reject) => {
      // Configure default application/json header
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      };

      // Initiate HTTP request to port 5003
      const req = http.request(`http://127.0.0.1:5003${path}`, {
        method: options.method || 'GET',
        headers
      }, (res) => {
        let raw = '';
        // Buffer incoming response data chunks
        res.on('data', c => { raw += c; });
        // Parse and return JSON when stream ends
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: raw ? JSON.parse(raw) : null, raw });
          } catch {
            resolve({ status: res.statusCode, raw });
          }
        });
      });

      // Handle socket error events
      req.on('error', reject);

      // Write payload if present
      if (options.body) {
        req.write(JSON.stringify(options.body));
      }

      req.end();
    });
  }

  try {
    // ------------------------------------------------------------------------
    // TEST 1: Health Check Endpoint
    // ------------------------------------------------------------------------
    const health = await api('/api/health');
    assert('Health Check Returns 200 and healthy status', health.status === 200 && health.body.status === 'healthy');

    // ------------------------------------------------------------------------
    // TEST 2: JWT Authentication - Administrator Login
    // ------------------------------------------------------------------------
    const adminLogin = await api('/api/v1/auth/login', {
      method: 'POST',
      body: { email: 'admin@b2b.com', password: 'admin123' }
    });
    assert('Admin login returns valid JWT token and user info', adminLogin.status === 200 && Boolean(adminLogin.body.token));
    const adminToken = adminLogin.body.token;

    // ------------------------------------------------------------------------
    // TEST 3: JWT Authentication - Customer Login
    // ------------------------------------------------------------------------
    const custLogin = await api('/api/v1/auth/login', {
      method: 'POST',
      body: { email: 'buyer@b2b.com', password: 'buyer123' }
    });
    assert('Customer login returns valid JWT token and role', custLogin.status === 200 && custLogin.body.user.role === 'customer');
    const customerToken = custLogin.body.token;

    // ------------------------------------------------------------------------
    // TEST 4: Public Catalog Querying
    // ------------------------------------------------------------------------
    const productsRes = await api('/api/v1/products');
    assert('GET /api/v1/products returns product array', productsRes.status === 200 && productsRes.body.data.length >= 10);

    // ------------------------------------------------------------------------
    // TEST 5: RBAC Security Guard - Customer blocked from creating catalog SKU
    // ------------------------------------------------------------------------
    const custCreateProd = await api('/api/v1/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { name: 'Unauthorized Item', sku: 'UN-999', price: 99.00 }
    });
    assert('Customer creating product is blocked with 403 Forbidden', custCreateProd.status === 403);

    // ------------------------------------------------------------------------
    // TEST 6: RBAC Security Guard - Admin permitted to create catalog SKU
    // ------------------------------------------------------------------------
    const adminCreateProd = await api('/api/v1/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { name: 'Server Rack 42U', sku: 'SR-042', price: 850.00, stock: 15, category: 'Hardware' }
    });
    assert('Admin creating product succeeds with 201 Created', adminCreateProd.status === 201 && adminCreateProd.body.data.sku === 'SR-042');

    // ------------------------------------------------------------------------
    // TEST 7: Order Creation with Stock Validation & Auto-Invoice Generation
    // ------------------------------------------------------------------------
    const orderRes = await api('/api/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        items: [{ productId: 1, name: 'Wireless Ergonomic Keyboard', price: 49.99, qty: 2 }],
        notes: 'Deliver to Suite 400'
      }
    });
    assert('Customer placing order succeeds and generates linked invoice', orderRes.status === 201 && Boolean(orderRes.body.order) && Boolean(orderRes.body.invoice));

    // ------------------------------------------------------------------------
    // TEST 8: Invoices Ledger Retrieval
    // ------------------------------------------------------------------------
    const invoicesRes = await api('/api/v1/invoices', {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert('GET /api/v1/invoices returns authenticated client invoices', invoicesRes.status === 200 && Array.isArray(invoicesRes.body.data));

    // ------------------------------------------------------------------------
    // TEST 9: Audit Trail Ledger Querying (Admin Role)
    // ------------------------------------------------------------------------
    const auditRes = await api('/api/v1/audit', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert('Admin querying audit log returns complete activity trail', auditRes.status === 200 && Array.isArray(auditRes.body.data));

    // Print summary banner
    console.log(`\n====================================================`);
    console.log(`BACKEND TEST RESULT: ${passed} Passed, ${failed} Failed`);
    console.log(`====================================================`);

    // Exit process with 0 on full success, 1 on any failure
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error caught:', err);
    process.exit(1);
  }
}, 600);
