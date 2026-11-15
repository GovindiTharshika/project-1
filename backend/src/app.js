/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/app.js
 * Description: NestJS-Style Application Gateway & Request Router
 * Dispatches HTTP requests to modular domain controllers, applies CORS headers,
 * enforces JWT authentication, and executes Role-Based Access Control (RBAC) guards.
 * ============================================================================
 */

// Import native Node.js filesystem and path utilities for serving static client assets
const fs = require('fs');
const path = require('path');

// Import domain controllers
const authController = require('./modules/auth/auth.controller');
const productsController = require('./modules/products/products.controller');
const ordersController = require('./modules/orders/orders.controller');
const invoicesController = require('./modules/invoices/invoices.controller');
const usersController = require('./modules/users/users.controller');
const auditController = require('./modules/audit/audit.controller');

// Import authentication and authorization interceptors
const authMiddleware = require('./middleware/auth.middleware');
const requireRole = require('./middleware/roles.middleware');

/**
 * Injects cross-origin resource sharing (CORS) headers into the response
 * @param {object} res - Node.js HTTP server response object
 */
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Asynchronously buffers and parses the incoming HTTP JSON request payload
 * @param {object} req - Node.js HTTP incoming message request object
 * @returns {Promise<object>} Parsed JavaScript object
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    // Collect data chunks from incoming network stream
    req.on('data', chunk => { body += chunk.toString(); });
    // When stream ends, parse accumulated JSON string
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

/**
 * Master request dispatch handler
 * @param {object} req - HTTP incoming message
 * @param {object} res - HTTP server response
 */
async function handleRequest(req, res) {
  // Apply standard CORS headers to every request
  setCorsHeaders(res);

  // Respond immediately with 204 No Content for pre-flight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Parse request URL and extract pathname and search parameters using WHATWG URL API
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // 0. Web Platform Homepage (Serves commercial portal on root localhost URL)
  if ((pathname === '/' || pathname === '/index.html') && method === 'GET') {
    try {
      // Resolve absolute file path to the single-page application index.html
      const htmlPath = path.resolve(__dirname, '../../index.html');
      // Read file content from local disk
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      // Return 200 OK with UTF-8 HTML header
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(htmlContent);
    } catch (err) {
      // Handle file access or disk read exceptions
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: `Failed to load Web Platform frontend: ${err.message}` }));
    }
  }

  // 1. API Directory & System Root Information (Provides interactive endpoint directory on localhost)
  if ((pathname === '/api' || pathname === '/api/v1') && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      name: 'OrderHub B2B Enterprise Platform REST API',
      version: '1.0.0',
      status: 'operational',
      environment: process.env.NODE_ENV || 'development',
      links: {
        web_portal: `http://${req.headers.host || 'localhost:5000'}/`,
        health_check: `http://${req.headers.host || 'localhost:5000'}/api/health`,
        endpoints: {
          auth_login: 'POST /api/v1/auth/login',
          auth_register: 'POST /api/v1/auth/register',
          auth_me: 'GET /api/v1/auth/me',
          products: 'GET, POST /api/v1/products',
          orders: 'GET, POST /api/v1/orders',
          invoices: 'GET /api/v1/invoices',
          users: 'GET /api/v1/users',
          audit: 'GET /api/v1/audit'
        }
      }
    }, null, 2));
  }

  // 2. Health check & system diagnostics endpoint
  if (pathname === '/api/health' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'healthy',
      service: 'B2B OrderHub Backend API',
      version: '2.0.0',
      timestamp: new Date().toISOString()
    }));
  }

  // 2. Authentication endpoints (Public)
  if (pathname === '/api/v1/auth/login' && method === 'POST') {
    const body = await parseBody(req);
    return authController.handleLogin(req, res, body);
  }

  if (pathname === '/api/v1/auth/register' && method === 'POST') {
    const body = await parseBody(req);
    return authController.handleRegister(req, res, body);
  }

  // Helper guard for routes requiring valid JWT authentication
  function requireAuth(handler) {
    authMiddleware(req, res, () => {
      handler();
    });
  }

  // Helper guard for routes requiring valid JWT AND specific roles
  function requireAuthWithRole(roles, handler) {
    authMiddleware(req, res, () => {
      requireRole(roles)(req, res, () => {
        handler();
      });
    });
  }

  // 3. Current Authenticated Profile
  if (pathname === '/api/v1/auth/me' && method === 'GET') {
    return requireAuth(() => authController.handleMe(req, res));
  }

  // 4. Products / Catalog Endpoints
  if (pathname === '/api/v1/products') {
    if (method === 'GET') {
      const query = {
        category: parsedUrl.searchParams.get('category'),
        search: parsedUrl.searchParams.get('search'),
        stockStatus: parsedUrl.searchParams.get('stock')
      };
      return productsController.handleGetAll(req, res, query);
    }
    if (method === 'POST') {
      // Product creation restricted strictly to Administrator role
      return requireAuthWithRole(['admin'], async () => {
        const body = await parseBody(req);
        return productsController.handleCreate(req, res, body);
      });
    }
  }

  // Update product stock level (e.g. PATCH /api/v1/products/:id/stock)
  const productStockMatch = pathname.match(/^\/api\/v1\/products\/(\d+)\/stock$/);
  if (productStockMatch && method === 'PATCH') {
    const id = productStockMatch[1];
    return requireAuthWithRole(['admin'], async () => {
      const body = await parseBody(req);
      return productsController.handleUpdateStock(req, res, id, body);
    });
  }

  // Single product detail (e.g. GET /api/v1/products/:id)
  const productSingleMatch = pathname.match(/^\/api\/v1\/products\/(\d+)$/);
  if (productSingleMatch && method === 'GET') {
    return productsController.handleGetOne(req, res, productSingleMatch[1]);
  }

  // 5. Orders Endpoints
  if (pathname === '/api/v1/orders') {
    if (method === 'GET') {
      return requireAuth(() => ordersController.handleGetAll(req, res));
    }
    if (method === 'POST') {
      return requireAuth(async () => {
        const body = await parseBody(req);
        return ordersController.handleCreate(req, res, body);
      });
    }
  }

  // Order status progression (e.g. PATCH /api/v1/orders/:id/status)
  const orderStatusMatch = pathname.match(/^\/api\/v1\/orders\/([^/]+)\/status$/);
  if (orderStatusMatch && (method === 'PATCH' || method === 'PUT')) {
    const id = orderStatusMatch[1];
    // Advancing order status restricted to Administrator and Sales roles
    return requireAuthWithRole(['admin', 'sales'], async () => {
      const body = await parseBody(req);
      return ordersController.handleUpdateStatus(req, res, id, body);
    });
  }

  // Single order lookup (e.g. GET /api/v1/orders/:id)
  const orderSingleMatch = pathname.match(/^\/api\/v1\/orders\/([^/]+)$/);
  if (orderSingleMatch && method === 'GET') {
    return requireAuth(() => ordersController.handleGetOne(req, res, orderSingleMatch[1]));
  }

  // 6. Invoices Endpoints
  if (pathname === '/api/v1/invoices' && method === 'GET') {
    return requireAuth(() => invoicesController.handleGetAll(req, res));
  }

  // Mark invoice paid (e.g. PATCH /api/v1/invoices/:id/pay)
  const invoicePaidMatch = pathname.match(/^\/api\/v1\/invoices\/([^/]+)\/pay$/);
  if (invoicePaidMatch && method === 'PATCH') {
    const id = invoicePaidMatch[1];
    // Payment settlement restricted strictly to Administrator role
    return requireAuthWithRole(['admin'], () => invoicesController.handleMarkPaid(req, res, id));
  }

  // Single invoice lookup (e.g. GET /api/v1/invoices/:id)
  const invoiceSingleMatch = pathname.match(/^\/api\/v1\/invoices\/([^/]+)$/);
  if (invoiceSingleMatch && method === 'GET') {
    return requireAuth(() => invoicesController.handleGetOne(req, res, invoiceSingleMatch[1]));
  }

  // 7. Users Management Endpoints (Admin only)
  if (pathname === '/api/v1/users' && method === 'GET') {
    return requireAuthWithRole(['admin'], () => usersController.handleGetAll(req, res));
  }

  // Toggle user status active/inactive (e.g. PATCH /api/v1/users/:id/toggle)
  const userToggleMatch = pathname.match(/^\/api\/v1\/users\/(\d+)\/toggle$/);
  if (userToggleMatch && method === 'PATCH') {
    return requireAuthWithRole(['admin'], () => usersController.handleToggleStatus(req, res, userToggleMatch[1]));
  }

  // 8. Audit Log Endpoints (Admin & Sales only)
  if (pathname === '/api/v1/audit' && method === 'GET') {
    const query = {
      type: parsedUrl.searchParams.get('type'),
      search: parsedUrl.searchParams.get('search')
    };
    return requireAuthWithRole(['admin', 'sales'], () => auditController.handleGetAll(req, res, query));
  }

  // Fallback: 404 Route Not Found
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: `Route ${method} ${pathname} not found on this server` }));
}

// Export request handler for HTTP server integration
module.exports = {
  handleRequest
};
