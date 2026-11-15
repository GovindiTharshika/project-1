/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Project: B2B Order Management Platform (OrderHub)
 * File: test.js (Root Test Suite Entry Point)
 * 
 * Description:
 * Master test runner executing the complete backend integration test suite
 * located in `backend/tests/api.test.js`.
 * Provides unified execution for `npm test` and `node test.js`.
 * ============================================================================
 */

// Inform the evaluator that the test runner is starting
console.log('>>> Running Master Test Suite for Arrowstack Project 1...');

// Execute the full integration test suite verifying:
// 1. System health check endpoint (/api/health)
// 2. Administrator JWT authentication
// 3. Customer JWT authentication
// 4. Public catalog browsing
// 5. RBAC security: Customer forbidden from creating products (403)
// 6. RBAC security: Admin permitted to create products (201)
// 7. Order placement with atomic stock deduction & auto Net-14 invoice generation
// 8. Customer invoice ledger retrieval
// 9. Immutable audit trail queries
require('./backend/tests/api.test.js');
