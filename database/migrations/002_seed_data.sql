-- ====================================================================
-- ARROWSTACK INTERNSHIP - PROJECT 1: B2B ORDER MANAGEMENT PLATFORM
-- Migration: 002_seed_data.sql
-- ====================================================================

-- SEED USERS (Password is 'password123' or role-specific)
INSERT INTO users (id, name, email, password_hash, role, company, status) VALUES
(1, 'Admin User', 'admin@b2b.com', '$2a$10$aSvfjIcanoxLoZ62Zjyqrehd22H.pM1x7r6VvtBDLwDB77AU1Is3W', 'admin', 'B2B Corp Global HQ', 'active'),
(2, 'Sarah Sales', 'sales@b2b.com', '$2a$10$kthmwvK7w0XPpbV/Voe7zuFxRq9JepRRP.JlT9UEQByzKxocILOae', 'sales', 'B2B Corp Global HQ', 'active'),
(3, 'Bob Buyer', 'buyer@b2b.com', '$2a$10$30VAeRuDg7aT5/BrzkOyFeqeQpOK8VwnQja4H.A8AK6.1ZqyDGmRS', 'customer', 'TechVentures Logistics Ltd', 'active'),
(4, 'Alice Chen', 'alice@corp.com', '$2a$10$/RbrKGUxrM8GEwTIajtJ4OVenIB5f5.BVonxVUVpgE0aeYf5ZZunO', 'customer', 'Nexus Supply Solutions', 'active')
ON CONFLICT (id) DO NOTHING;

-- SEED PRODUCTS (Diverse B2B catalog)
INSERT INTO products (id, sku, name, category, description, price, stock_quantity, min_stock_level, emoji) VALUES
(1, 'KB-001', 'Wireless Ergonomic Keyboard', 'Electronics', 'Low-profile wireless mechanical keyboard with dual-mode connectivity', 49.99, 150, 20, '⌨️'),
(2, 'HB-002', 'USB-C Enterprise Hub 7-in-1', 'Electronics', '4K HDMI, Gigabit Ethernet, 100W Power Delivery and dual USB 3.2', 34.99, 85, 15, '🔌'),
(3, 'MS-003', 'Dual Monitor Articulating Arm', 'Furniture', 'Heavy-duty gas spring aluminum monitor stand for dual 32" screens', 89.00, 12, 10, '🖥️'),
(4, 'BP-004', 'Commercial Ballpoint Pens (Box 50)', 'Office Supplies', 'Bulk box of 50 smooth gel ink blue ballpoint pens for office use', 12.99, 320, 40, '🖊️'),
(5, 'WM-005', 'Rechargeable Optical Mouse', 'Electronics', 'Precision 4000 DPI ergonomic silent click wireless mouse', 29.99, 8, 10, '🖱️'),
(6, 'DL-006', 'Dimmable LED Workstation Lamp', 'Accessories', 'Glare-free reading light with Qi wireless charging base', 44.00, 0, 5, '💡'),
(7, 'AP-007', 'Premium Multipurpose A4 Paper (Case)', 'Office Supplies', 'Case of 5 reams (2500 sheets) bright white 80gsm paper', 38.50, 540, 60, '📄'),
(8, 'OC-008', 'Executive Mesh Ergonomic Chair', 'Furniture', 'High-back breathable mesh chair with 3D armrests and lumbar support', 299.00, 5, 5, '🪑'),
(9, 'WC-009', 'Full HD 1080p Conference Webcam', 'Electronics', 'Wide-angle lens with dual noise-canceling stereo microphones', 69.99, 40, 10, '📷'),
(10, 'SN-010', 'Self-Adhesive Notes Value Pack', 'Office Supplies', 'Multi-color pack of 12 pads (100 sheets each) 3x3 inches', 8.99, 210, 25, '🗒️')
ON CONFLICT (id) DO NOTHING;

-- SEED ORDERS
INSERT INTO orders (id, customer_id, total_amount, status, notes, order_date) VALUES
('ORD-001', 3, 459.92, 'delivered', 'Deliver to Loading Dock B before 4 PM', '2024-11-01'),
('ORD-002', 4, 1009.80, 'shipped', 'Carrier: FedEx Freight Tracking #FX-98214', '2024-11-05'),
('ORD-003', 3, 474.50, 'processing', 'Priority batch fulfillment', '2024-11-08'),
('ORD-004', 4, 1396.00, 'confirmed', 'Awaiting batch pick at central warehouse', '2024-11-10'),
('ORD-005', 3, 524.85, 'pending', 'Customer requested delivery date 2024-11-20', '2024-11-12')
ON CONFLICT (id) DO NOTHING;

-- SEED ORDER ITEMS
INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal) VALUES
('ORD-001', 1, 'Wireless Ergonomic Keyboard', 49.99, 5, 249.95),
('ORD-001', 9, 'Full HD 1080p Conference Webcam', 69.99, 3, 209.97),
('ORD-002', 3, 'Dual Monitor Articulating Arm', 89.00, 10, 890.00),
('ORD-002', 4, 'Commercial Ballpoint Pens (Box 50)', 12.99, 9, 116.91),
('ORD-003', 7, 'Premium Multipurpose A4 Paper (Case)', 38.50, 12, 462.00),
('ORD-004', 8, 'Executive Mesh Ergonomic Chair', 299.00, 4, 1196.00),
('ORD-004', 1, 'Wireless Ergonomic Keyboard', 49.99, 4, 199.96),
('ORD-005', 2, 'USB-C Enterprise Hub 7-in-1', 34.99, 15, 524.85);

-- SEED INVOICES
INSERT INTO invoices (id, order_id, customer_id, amount, issue_date, due_date, status, paid_at) VALUES
('INV-001', 'ORD-001', 3, 459.92, '2024-11-01', '2024-11-15', 'paid', '2024-11-06 14:22:00+00'),
('INV-002', 'ORD-002', 4, 1009.80, '2024-11-05', '2024-11-19', 'pending', NULL),
('INV-003', 'ORD-003', 3, 474.50, '2024-11-08', '2024-11-22', 'pending', NULL),
('INV-004', 'ORD-004', 4, 1396.00, '2024-11-10', '2024-11-10', 'overdue', NULL),
('INV-005', 'ORD-005', 3, 524.85, '2024-11-12', '2024-11-26', 'pending', NULL)
ON CONFLICT (id) DO NOTHING;

-- SEED AUDIT LOGS
INSERT INTO audit_logs (event_type, actor, actor_id, action_details, severity) VALUES
('auth', 'Admin User', 1, 'System initialized and primary database migration completed', 'info'),
('auth', 'Sarah Sales', 2, 'Sales operator authenticated into order routing module', 'info'),
('order', 'Bob Buyer', 3, 'Created purchase order ORD-005 totaling $524.85 for 15 units', 'info'),
('invoice', 'System Daemon', NULL, 'Automated invoice INV-004 transitioned to overdue status', 'warn'),
('order', 'Sarah Sales', 2, 'Order ORD-002 marked as SHIPPED with FedEx tracking #FX-98214', 'info');

-- Keep SERIAL sequences aligned after explicit seed IDs.
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval(pg_get_serial_sequence('products', 'id'), COALESCE((SELECT MAX(id) FROM products), 1));
SELECT setval(pg_get_serial_sequence('order_items', 'id'), COALESCE((SELECT MAX(id) FROM order_items), 1));
SELECT setval(pg_get_serial_sequence('audit_logs', 'id'), COALESCE((SELECT MAX(id) FROM audit_logs), 1));

