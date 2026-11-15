/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/modules/orders/orders.controller.js
 * Description: Orders Controller Layer
 * Handles endpoints for listing purchase orders, fetching order details,
 * placing new orders with stock checks, and updating fulfillment statuses.
 * ============================================================================
 */

// Import orders business logic service
const ordersService = require('./orders.service');

class OrdersController {
  /**
   * Handles GET /api/v1/orders
   * Retrieves all orders or caller's own orders based on role
   * @param {object} req - HTTP request (contains req.user)
   * @param {object} res - HTTP response
   */
  async handleGetAll(req, res) {
    try {
      const data = await ordersService.findAll(req.user);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, count: data.length, data }));
    } catch (err) {
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }

  /**
   * Handles GET /api/v1/orders/:id
   * Retrieves order details by ID
   * @param {object} req - HTTP request (contains req.user)
   * @param {object} res - HTTP response
   * @param {string} id - Order ID
   */
  async handleGetOne(req, res, id) {
    try {
      const data = await ordersService.findOne(id, req.user);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data }));
    } catch (err) {
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }

  /**
   * Handles POST /api/v1/orders
   * Submits new purchase order from cart items
   * @param {object} req - HTTP request (contains req.user)
   * @param {object} res - HTTP response
   * @param {object} body - Order body { items, notes }
   */
  async handleCreate(req, res, body) {
    try {
      const result = await ordersService.create(body, req.user);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }

  /**
   * Handles PATCH /api/v1/orders/:id/status
   * Updates fulfillment progression status (Admin / Sales role required)
   * @param {object} req - HTTP request (contains req.user)
   * @param {object} res - HTTP response
   * @param {string} id - Order ID
   * @param {object} body - Body containing { status: string }
   */
  async handleUpdateStatus(req, res, id, body) {
    try {
      const data = await ordersService.updateStatus(id, body.status, req.user);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data }));
    } catch (err) {
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }
}

// Export singleton instance of OrdersController
module.exports = new OrdersController();
