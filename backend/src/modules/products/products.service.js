/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/modules/products/products.service.js
 * Description: Product & Inventory Service Layer
 * Business logic for catalog retrieval, keyword search, category filtering,
 * stock status classification, product creation, and inventory level updates.
 * ============================================================================
 */

// Import database instance
const db = require('../../config/database');

class ProductsService {
  /**
   * Retrieves products filtered by optional query parameters
   * @param {object} query - Filtering options { category, search, stockStatus }
   * @returns {Promise<Array>} List of matching products
   */
  async findAll(query = {}) {
    const { category, search, stockStatus } = query;
    let list = db.state.products;

    // Filter by specific product category (case-insensitive)
    if (category) {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by keyword match in product name or SKU
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }

    // Filter by stock level status ('in', 'low', 'out')
    if (stockStatus === 'in') {
      list = list.filter(p => p.stock > p.minStock);
    } else if (stockStatus === 'low') {
      list = list.filter(p => p.stock > 0 && p.stock <= p.minStock);
    } else if (stockStatus === 'out') {
      list = list.filter(p => p.stock === 0);
    }

    return list;
  }

  /**
   * Retrieves a single product by its unique primary key
   * @param {number|string} id - Product ID
   * @returns {Promise<object>}
   */
  async findOne(id) {
    const item = db.state.products.find(p => p.id === parseInt(id));
    if (!item) {
      throw { status: 404, message: 'Product not found in catalog' };
    }
    return item;
  }

  /**
   * Creates a new wholesale product SKU (Admin only)
   * @param {object} data - Product creation payload
   * @param {object} user - Authenticated administrator claims
   * @returns {Promise<object>} The newly created product
   */
  async create(data, user) {
    const { name, sku, category, price, stock, minStock, emoji, description } = data;

    // Validate required fields
    if (!name || !sku || price === undefined) {
      throw { status: 422, message: 'Validation failed: name, sku, and price are required fields' };
    }

    // Validate price non-negativity constraint
    if (parseFloat(price) < 0) {
      throw { status: 422, message: 'Validation failed: price must be a non-negative number' };
    }

    // Enforce uniqueness constraint on SKU
    if (db.state.products.find(p => p.sku.toLowerCase() === sku.toLowerCase())) {
      throw { status: 409, message: `A product with SKU '${sku}' already exists` };
    }

    // Instantiate product entity
    const newProd = {
      id: db.state.products.length + 1,
      sku: sku.toUpperCase(),
      name,
      category: category || 'General',
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      minStock: parseInt(minStock) || 5,
      emoji: emoji || '📦',
      description: description || ''
    };

    // Save to product store
    db.state.products.push(newProd);

    // Record product addition in audit trail
    db.log('product', user ? user.name : 'Admin', `Created new catalog product "${name}" (SKU: ${sku})`, 'blue');

    return newProd;
  }

  /**
   * Updates warehouse stock quantity for a product (Admin only)
   * @param {number|string} id - Product ID
   * @param {number|string} newStock - New inventory count
   * @param {object} user - Authenticated administrator claims
   * @returns {Promise<object>} The updated product
   */
  async updateStock(id, newStock, user) {
    // Retrieve product or throw 404
    const item = await this.findOne(id);

    const parsedStock = parseInt(newStock);
    if (isNaN(parsedStock) || parsedStock < 0) {
      throw { status: 400, message: 'Stock quantity must be a non-negative integer' };
    }

    const oldStock = item.stock;
    item.stock = parsedStock;

    // Log the inventory level modification
    db.log(
      'product',
      user ? user.name : 'System',
      `Updated stock for "${item.name}" from ${oldStock} to ${parsedStock} units`,
      parsedStock === 0 ? 'orange' : 'blue'
    );

    return item;
  }
}

const productsInstance = new ProductsService();
module.exports = process.env.USE_PG === 'true' ? require('./products.pg.service') : productsInstance;
