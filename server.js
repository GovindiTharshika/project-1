/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Project: B2B Order Management Platform (OrderHub)
 * File: server.js (Root Server Entry Point)
 * 
 * Description:
 * Master application bootstrap delegating to the modular Node.js / NestJS
 * backend server located in `backend/src/server.js`.
 * Provides unified execution for `npm start` and `node server.js`.
 * ============================================================================
 */

// Inform the developer / evaluator of the server startup sequence
console.log('>>> Initializing Arrowstack Project 1: B2B Order Management Platform...');

// Delegate execution directly to the modular backend server
// This binds all domain modules (Auth, Products, Orders, Invoices, Users, Audit)
// and activates JWT authentication with Role-Based Access Control (RBAC).
const server = require('./backend/src/server');

// Export server instance for external harnesses and tools
module.exports = server;
