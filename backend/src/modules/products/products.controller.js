/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/modules/products/products.controller.js
 * Description: Product Controller Layer
 * Handles endpoints for product browsing, single item lookup, product creation,
 * and stock quantity updates.
 * ============================================================================
 */

// Import products business logic service
const productsService = require('./products.service');

class ProductsController {
  /**
   * Handles GET /api/v1/products
   * Retrieves all products or filtered subsets
   * @param {object} req - HTTP request
   * @param {object} res - HTTP response
   * @param {object} query - URL search parameters
   */
  async handleGetAll(req, res, query) {
    try {
      const data = await productsService.findAll(query);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, count: data.length, data }));
    } catch (err) {
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }

  /**
   * Handles GET /api/v1/products/:id
   * Retrieves single product by ID
   * @param {object} req - HTTP request
   * @param {object} res - HTTP response
   * @param {string} id - Product ID from URL
   */
  async handleGetOne(req, res, id) {
    try {
      const data = await productsService.findOne(id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data }));
    } catch (err) {
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }

  /**
   * Handles POST /api/v1/products
   * Creates new catalog item (Admin role required)
   * @param {object} req - HTTP request (contains req.user)
   * @param {object} res - HTTP response
   * @param {object} body - Product payload
   */
  async handleCreate(req, res, body) {
    try {
      const data = await productsService.create(body, req.user);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data }));
    } catch (err) {
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }

  /**
   * Handles PATCH /api/v1/products/:id/stock
   * Updates warehouse stock quantity (Admin role required)
   * @param {object} req - HTTP request (contains req.user)
   * @param {object} res - HTTP response
   * @param {string} id - Product ID from URL
   * @param {object} body - Body containing { stock: number }
   */
  async handleUpdateStock(req, res, id, body) {
    try {
      const data = await productsService.updateStock(id, body.stock, req.user);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data }));
    } catch (err) {
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }
}

// Export singleton instance of ProductsController
module.exports = new ProductsController();
