/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/server.js
 * Description: HTTP Server Bootstrap
 * Initializes the Node.js HTTP server instance, binds to the designated PORT,
 * and starts listening for incoming REST API client traffic.
 * ============================================================================
 */

// Import native HTTP server module from Node.js standard library
const http = require('http');

// Import the central application request handler from app.js
const { handleRequest } = require('./app');

// Define network port (environment variable PORT takes precedence; defaults to 5000)
const PORT = process.env.PORT || 5000;

// Create standard HTTP server instance passing our modular request dispatcher
const server = http.createServer(handleRequest);

// Start listening for network connections
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` 🏢 OrderHub B2B Enterprise Platform Server Online!`);
  console.log(` 🌐 Web Platform  : http://localhost:${PORT}`);
  console.log(` 🔌 REST API Base : http://localhost:${PORT}/api/v1`);
  console.log(` 🩺 Health Check  : http://localhost:${PORT}/api/health`);
  console.log(` 📚 API Directory : http://localhost:${PORT}/api`);
  console.log(` 🛡️  JWT RBAC      : Active (Admin, Sales, Customer)`);
  console.log(`====================================================`);
});

// Export server instance for integration testing
module.exports = server;
