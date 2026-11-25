const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const { handleRequest } = require('../backend/src/app');

function mockApi(method, urlPath, headers = {}, body = null) {
  return new Promise((resolve) => {
    const req = new EventEmitter();
    req.method = method;
    req.url = urlPath;
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
      write(chunk) { if (chunk) raw += chunk.toString(); },
      end(chunk) {
        if (chunk) raw += chunk.toString();
        let parsed = null;
        try { parsed = JSON.parse(raw); } catch (_) { parsed = raw; }
        resolve({ status: this.statusCode, headers: resHeaders, body: parsed });
      }
    };

    handleRequest(req, res);

    if (body) {
      const payload = typeof body === 'string' ? body : JSON.stringify(body);
      req.emit('data', Buffer.from(payload));
    }
    req.emit('end');
  });
}

async function run() {
  const outDir = path.join(__dirname, '..', 'validation-evidence', 'api-responses');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // 1. Admin Login
  const adminLogin = await mockApi('POST', '/api/v1/auth/login', { 'content-type': 'application/json' }, { email: 'admin@b2b.com', password: 'admin123' });
  fs.writeFileSync(path.join(outDir, '01-auth-login-admin.json'), JSON.stringify(adminLogin.body, null, 2));
  const adminToken = adminLogin.body.data ? adminLogin.body.data.token : null;

  // 2. Customer Login
  const custLogin = await mockApi('POST', '/api/v1/auth/login', { 'content-type': 'application/json' }, { email: 'buyer@b2b.com', password: 'buyer123' });
  fs.writeFileSync(path.join(outDir, '02-auth-login-customer.json'), JSON.stringify(custLogin.body, null, 2));
  const custToken = custLogin.body.data ? custLogin.body.data.token : null;

  // 3. Warehouse Login
  const whLogin = await mockApi('POST', '/api/v1/auth/login', { 'content-type': 'application/json' }, { email: 'warehouse@b2b.com', password: 'warehouse123' });
  fs.writeFileSync(path.join(outDir, '03-auth-login-warehouse.json'), JSON.stringify(whLogin.body, null, 2));

  // 4. Products Catalog
  const products = await mockApi('GET', '/api/v1/products', { authorization: `Bearer ${custToken}` });
  fs.writeFileSync(path.join(outDir, '04-products-catalog.json'), JSON.stringify(products.body, null, 2));

  // 5. Order Creation
  const newOrder = await mockApi('POST', '/api/v1/orders', {
    authorization: `Bearer ${custToken}`,
    'content-type': 'application/json',
    'idempotency-key': 'PO-VAL-2026-X01'
  }, {
    items: [{ productId: 1, qty: 5 }, { productId: 2, qty: 2 }],
    notes: 'Validation evidence submission sample order'
  });
  fs.writeFileSync(path.join(outDir, '05-orders-created.json'), JSON.stringify(newOrder.body, null, 2));

  // 6. Invoices
  const invoices = await mockApi('GET', '/api/v1/invoices', { authorization: `Bearer ${custToken}` });
  fs.writeFileSync(path.join(outDir, '06-invoices-list.json'), JSON.stringify(invoices.body, null, 2));

  // 7. Audit Trail
  const audit = await mockApi('GET', '/api/v1/audit', { authorization: `Bearer ${adminToken}` });
  fs.writeFileSync(path.join(outDir, '07-audit-trail.json'), JSON.stringify(audit.body, null, 2));

  // 8. APM Metrics
  const metrics = await mockApi('GET', '/api/v1/metrics', { authorization: `Bearer ${adminToken}` });
  fs.writeFileSync(path.join(outDir, '08-apm-telemetry.json'), JSON.stringify(metrics.body, null, 2));

  // 9. Diagnostics
  const diag = await mockApi('GET', '/api/health/diagnostics');
  fs.writeFileSync(path.join(outDir, '09-health-diagnostics.json'), JSON.stringify(diag.body, null, 2));

  // 10. Automation
  const auto = await mockApi('POST', '/api/v1/automation/run', { authorization: `Bearer ${adminToken}` });
  fs.writeFileSync(path.join(outDir, '10-automation-run.json'), JSON.stringify(auto.body, null, 2));

  console.log('Successfully generated 10 API response files in validation-evidence/api-responses/');
}

run();
