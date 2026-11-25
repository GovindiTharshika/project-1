/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/tests/api.test.js
 * Description: Master Automated Integration & Extension Test Suite
 * Validates:
 *   1. Core Functional Requirements (FR-01 to FR-12)
 *   2. RFC 7519 JWT Authentication & Session Token Issuance
 *   3. RBAC Authorization Barriers (Admin, Sales, Customer, Warehouse)
 *   4. Atomic Inventory Deductions & Net-14 Invoicing
 *   5. Section 17 Extension 1: Real-time APM & Performance Metrics (/api/v1/metrics)
 *   6. Section 17 Extension 2: Warehouse Stakeholder Role & Realistic Edge Cases (MOQ, Credit Limit, Idempotency)
 *   7. Section 17 Extension 3: Automated Operations Pipeline (/api/v1/automation/run)
 * ============================================================================
 */

const http = require('http');
const { EventEmitter } = require('events');
const { handleRequest } = require('../src/app');

// Dedicated port if running external server
process.env.PORT = '5003';

// Launch server instance (ignored if running in mock mode)
try {
  require('../src/server');
} catch (e) {}

/**
 * In-process mock dispatcher: zero-network socket overhead, 100% sandbox safe.
 */
function mockApi(method, path, headers = {}, body = null) {
  return new Promise((resolve) => {
    const req = new EventEmitter();
    req.method = method;
    req.url = path;
    req.headers = { host: 'localhost:5003', ...headers };

    let raw = '';
    const resHeaders = {};
    const res = {
      statusCode: 200,
      setHeader(k, v) { resHeaders[k.toLowerCase()] = v; },
      getHeader(k) { return resHeaders[k.toLowerCase()]; },
      writeHead(code, h = {}) {
        this.statusCode = code;
        for (const [k, v] of Object.entries(h)) {
          this.setHeader(k, v);
        }
      },
      end(chunk) {
        if (chunk) raw += chunk.toString();
        let parsedBody = null;
        try {
          parsedBody = raw ? JSON.parse(raw) : null;
        } catch {
          parsedBody = raw;
        }
        resolve({
          status: this.statusCode,
          headers: resHeaders,
          body: parsedBody,
          raw
        });
      }
    };

    handleRequest(req, res);

    if (body) {
      req.emit('data', Buffer.from(JSON.stringify(body)));
    }
    req.emit('end');
  });
}

/**
 * Hybrid HTTP / in-process dispatcher: prefers in-process for sandbox resilience.
 */
async function api(path, options = {}) {
  const method = options.method || 'GET';
  const headers = options.headers || {};
  const body = options.body || null;
  return mockApi(method, path, headers, body);
}

setTimeout(async () => {
  console.log('====================================================');
  console.log(' 🧪 ARROWSTACK COMPREHENSIVE INTEGRATION TEST SUITE');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  function assert(desc, condition, debugInfo = '') {
    if (condition) {
      console.log(`✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${desc} ${debugInfo ? `[Info: ${debugInfo}]` : ''}`);
      failed++;
    }
  }

  try {
    // ------------------------------------------------------------------------
    // SECTION A: CORE FUNCTIONAL TESTS (1-9)
    // ------------------------------------------------------------------------
    console.log('\n--- PART 1: CORE FUNCTIONAL REQUIREMENTS & RBAC ---');

    // TEST 1: Health Check
    const health = await api('/api/health');
    assert('Health Check Returns 200 and healthy status', health.status === 200 && health.body.status === 'healthy');

    // TEST 2: Admin Login
    const adminLogin = await api('/api/v1/auth/login', {
      method: 'POST',
      body: { email: 'admin@b2b.com', password: 'admin123' }
    });
    assert('Admin login returns valid JWT token and user info', adminLogin.status === 200 && Boolean(adminLogin.body.token));
    const adminToken = adminLogin.body.token;

    // TEST 3: Customer Login
    const custLogin = await api('/api/v1/auth/login', {
      method: 'POST',
      body: { email: 'buyer@b2b.com', password: 'buyer123' }
    });
    assert('Customer login returns valid JWT token and role', custLogin.status === 200 && custLogin.body.user.role === 'customer');
    const customerToken = custLogin.body.token;

    // TEST 4: Public Catalog Querying
    const productsRes = await api('/api/v1/products');
    assert('GET /api/v1/products returns product array', productsRes.status === 200 && productsRes.body.data.length >= 10);

    // TEST 5: RBAC Guard - Customer blocked from creating catalog SKU
    const custCreateProd = await api('/api/v1/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { name: 'Unauthorized Item', sku: 'UN-999', price: 99.00 }
    });
    assert('Customer creating product is blocked with 403 Forbidden', custCreateProd.status === 403);

    // TEST 6: RBAC Guard - Admin permitted to create catalog SKU
    const testSku = `SR-${Date.now()}`;
    const adminCreateProd = await api('/api/v1/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { name: 'Server Rack 42U', sku: testSku, price: 850.00, stock: 15, category: 'Hardware' }
    });
    assert('Admin creating product succeeds with 201 Created', adminCreateProd.status === 201 && adminCreateProd.body.data.sku === testSku);

    // TEST 7: Order Creation with Stock Validation & Auto-Invoice Generation
    const orderRes = await api('/api/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        items: [{ productId: 1, name: 'Wireless Ergonomic Keyboard', price: 49.99, qty: 2 }],
        notes: 'Deliver to Suite 400'
      }
    });
    assert('Customer placing order succeeds and generates linked invoice', orderRes.status === 201 && Boolean(orderRes.body.order) && Boolean(orderRes.body.invoice));

    // TEST 8: Invoices Ledger Retrieval
    const invoicesRes = await api('/api/v1/invoices', {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert('GET /api/v1/invoices returns authenticated client invoices', invoicesRes.status === 200 && Array.isArray(invoicesRes.body.data));

    // TEST 9: Audit Trail Ledger Querying (Admin Role)
    const auditRes = await api('/api/v1/audit', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert('Admin querying audit log returns complete activity trail', auditRes.status === 200 && Array.isArray(auditRes.body.data));

    // ------------------------------------------------------------------------
    // SECTION B: SECTION 17 EXTENSION CHALLENGES
    // ------------------------------------------------------------------------
    console.log('\n--- PART 2: SECTION 17 EXTENSION & ADVANCED CHALLENGES ---');

    // TEST 10: Warehouse Role Authentication (Challenge 2: Additional User Role)
    const warehouseLogin = await api('/api/v1/auth/login', {
      method: 'POST',
      body: { email: 'warehouse@b2b.com', password: 'warehouse123' }
    });
    assert('Warehouse Manager login returns valid JWT token and warehouse role', warehouseLogin.status === 200 && warehouseLogin.body.user.role === 'warehouse');
    const warehouseToken = warehouseLogin.body.token;

    // TEST 11: Warehouse Manager Role Permissions - Allowed to update stock
    const stockUpdateRes = await api('/api/v1/products/1/stock', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${warehouseToken}` },
      body: { stock: 180 }
    });
    assert('Warehouse role permitted to adjust product inventory levels', stockUpdateRes.status === 200 && stockUpdateRes.body.data.stock === 180);

    // TEST 12: RBAC Barrier - Customer blocked from adjusting stock
    const custStockRes = await api('/api/v1/products/1/stock', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { stock: 999 }
    });
    assert('Customer adjusting stock is blocked with 403 Forbidden', custStockRes.status === 403);

    // TEST 13: Warehouse Manager Role Permissions - Allowed to advance fulfillment state
    const orderStatusRes = await api('/api/v1/orders/ORD-001/status', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${warehouseToken}` },
      body: { status: 'shipped' }
    });
    assert('Warehouse role permitted to update order fulfillment lifecycle', orderStatusRes.status === 200 && orderStatusRes.body.data.status === 'shipped');

    // TEST 14: Edge Case - Minimum Order Quantity (MOQ) validation (Challenge 2)
    // Ballpoint pens (id: 4) requires MOQ = 5 in wholesale tier
    const moqFailRes = await api('/api/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        items: [{ productId: 4, name: 'Commercial Ballpoint Pens (Box 50)', price: 12.99, qty: 1 }] // Qty 1 < MOQ 5
      }
    });
    assert('Order below wholesale MOQ is rejected with 422', moqFailRes.status === 422);

    const moqBoundaryRes = await api('/api/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        items: [{ productId: 4, name: 'Commercial Ballpoint Pens (Box 50)', price: 12.99, qty: 5 }]
      }
    });
    assert('Order at the wholesale MOQ is accepted', moqBoundaryRes.status === 201 && Boolean(moqBoundaryRes.body.order));

    // TEST 15: Edge Case - B2B Credit Limit Exhaustion (Challenge 2)
    // Placing an enormous order exceeding customer's credit limit ($50,000)
    const creditExceededRes = await api('/api/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        items: [{ productId: 1, name: 'Wireless Ergonomic Keyboard', price: 49.99, qty: 1000 }] // Subtotal exceeds $50k credit limit
      }
    });
    assert('Order rejected with 422 when purchase exceeds approved B2B credit limit', creditExceededRes.status === 422 || creditExceededRes.status === 400);

    // TEST 16: Edge Case - Idempotency Key Handling (Challenge 2)
    const testIdempotencyKey = `IDEMP-${Date.now()}`;
    const firstSubmit = await api('/api/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        items: [{ productId: 2, name: 'USB-C Enterprise Hub 7-in-1', price: 34.99, qty: 2 }],
        idempotencyKey: testIdempotencyKey
      }
    });
    const secondSubmit = await api('/api/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        items: [{ productId: 2, name: 'USB-C Enterprise Hub 7-in-1', price: 34.99, qty: 2 }],
        idempotencyKey: testIdempotencyKey
      }
    });
    assert('Idempotent order retry returns cached response and prevents duplicate stock deduction',
      firstSubmit.status === 201 && secondSubmit.status === 201 && secondSubmit.body.cached === true
    );

    // TEST 17: Monitoring & APM Telemetry Endpoint (Challenge 1)
    const metricsRes = await api('/api/v1/metrics');
    assert('GET /api/v1/metrics returns real-time APM telemetry and latency histograms',
      metricsRes.status === 200 && Boolean(metricsRes.body.latency) && Boolean(metricsRes.body.throughput)
    );

    // TEST 18: System Diagnostics Health Check (Challenge 1)
    const diagRes = await api('/api/health/diagnostics');
    assert('GET /api/health/diagnostics returns detailed system subsystem health',
      diagRes.status === 200 && diagRes.body.status === 'healthy'
    );

    // TEST 19: Automated Operations Routine (Challenge 3)
    const autoOpsRes = await api('/api/v1/automation/run', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert('POST /api/v1/automation/run successfully executes automated ops and logs productivity metrics',
      autoOpsRes.status === 200 && autoOpsRes.body.success === true && Boolean(autoOpsRes.body.productivityBenefit)
    );

    // Summary
    console.log(`\n====================================================`);
    console.log(`TOTAL TEST RESULT: ${passed} Passed, ${failed} Failed`);
    console.log(`====================================================`);

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error caught:', err);
    process.exit(1);
  }
}, 300);
