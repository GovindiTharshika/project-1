-- ====================================================================
-- ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
-- Project: B2B Order Management Platform (OrderHub)
-- File: schema.sql (Master Relational Database Definition)
-- Target Database Engine: PostgreSQL 15+ (Compatible with SQLite / MySQL)
-- ====================================================================

-- Enable cryptographic UUID extension if UUID generation is required
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- TABLE 1: USERS (Role-Based Access Control Entity)
-- Stores accounts for Administrators, Sales Reps, and Wholesale Buyers
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    -- Auto-incrementing unique user identifier
    id SERIAL PRIMARY KEY,
    -- Full legal or representative name
    name VARCHAR(100) NOT NULL,
    -- Unique corporate email address for authentication
    email VARCHAR(150) UNIQUE NOT NULL,
    -- Bcrypt / PBKDF2 hashed password string
    password_hash VARCHAR(255) NOT NULL,
    -- System access role strictly bounded by CHECK constraint
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'sales', 'customer', 'warehouse')),
    -- Registered company or subsidiary organization name
    company VARCHAR(150) NOT NULL,
    -- Account lifecycle status (active, inactive, suspended)
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    -- Timestamps for creation and update tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- TABLE 2: PRODUCTS (Wholesale Catalog & Inventory Entity)
-- Tracks product SKUs, pricing, stock levels, and safety thresholds
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    -- Auto-incrementing product identifier
    id SERIAL PRIMARY KEY,
    -- Unique commercial Stock Keeping Unit (e.g. 'KB-001')
    sku VARCHAR(50) UNIQUE NOT NULL,
    -- Display title of the product
    name VARCHAR(200) NOT NULL,
    -- Category classification (Electronics, Furniture, Office Supplies)
    category VARCHAR(100) NOT NULL,
    -- Detailed item specification and description
    description TEXT,
    -- Unit price enforced to be non-negative
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    -- Current available units in warehouse
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    -- Minimum threshold below which low-stock alerts are triggered
    min_stock_level INT NOT NULL DEFAULT 5 CHECK (min_stock_level >= 0),
    -- Smallest allowed wholesale order quantity for this product
    min_order_quantity INT NOT NULL DEFAULT 1 CHECK (min_order_quantity >= 1),
    -- Visual icon emoji for UI rendering
    emoji VARCHAR(20) DEFAULT '📦',
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- TABLE 3: ORDERS (Procurement Header Entity)
-- Represents purchase orders placed by wholesale clients
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    -- Alphanumeric order reference (e.g., 'ORD-001')
    id VARCHAR(50) PRIMARY KEY,
    -- Foreign key linking to the purchasing user in `users`
    customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Total order sum including items and commercial tax
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    -- Multi-step fulfillment lifecycle state
    status VARCHAR(30) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    -- Special instructions or delivery notes
    notes TEXT,
    -- Date the purchase order was submitted
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- TABLE 4: ORDER_ITEMS (Normalized Order Line Items)
-- Foreign-key linked items capturing historical purchase price & qty
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    -- Auto-incrementing line item key
    id SERIAL PRIMARY KEY,
    -- Foreign key to parent order
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    -- Foreign key to the catalog product
    product_id INT NOT NULL REFERENCES products(id),
    -- Snapshot of product name at purchase time
    product_name VARCHAR(200) NOT NULL,
    -- Snapshot of unit price at purchase time
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    -- Purchased volume (strictly positive)
    quantity INT NOT NULL CHECK (quantity > 0),
    -- Line subtotal (unit_price * quantity)
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0)
);

-- --------------------------------------------------------------------
-- TABLE 5: INVOICES (Commercial Billing & Accounts Receivable)
-- Net-14 payment schedules generated automatically upon order entry
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoices (
    -- Unique invoice identifier (e.g. 'INV-001')
    id VARCHAR(50) PRIMARY KEY,
    -- Foreign key linking directly to the originating order
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    -- Foreign key to customer account
    customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Total amount due
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    -- Date invoice was issued
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    -- Net-14 payment deadline
    due_date DATE NOT NULL,
    -- Payment reconciliation state
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    -- Timestamp when payment was marked as settled
    paid_at TIMESTAMP WITH TIME ZONE,
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- TABLE 6: AUDIT_LOGS (Immutable Regulatory Activity Ledger)
-- Records who modified what, when, and from what IP address
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    -- Auto-incrementing log record identifier
    id SERIAL PRIMARY KEY,
    -- Event classification ('auth', 'order', 'product', 'invoice', 'user')
    event_type VARCHAR(50) NOT NULL,
    -- Human-readable actor attribution name
    actor VARCHAR(100) NOT NULL,
    -- Optional foreign key linkage to user ID
    actor_id INT REFERENCES users(id) ON DELETE SET NULL,
    -- Complete narrative description of the operation
    action_details TEXT NOT NULL,
    -- Severity level ('info', 'warn', 'alert')
    severity VARCHAR(20) DEFAULT 'info',
    -- Client IPv4 / IPv6 address
    ip_address VARCHAR(45),
    -- Immutable creation timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- INDEXES FOR QUERY OPTIMIZATION & WORKLOAD SCALABILITY
-- Accelerates lookups for orders, customer invoices, and inventory
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_order ON invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
