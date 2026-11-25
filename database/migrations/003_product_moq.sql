-- Add and seed per-product minimum order quantities (MOQ).
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS min_order_quantity INT NOT NULL DEFAULT 1
    CHECK (min_order_quantity >= 1);

UPDATE products
SET min_order_quantity = 5
WHERE sku = 'BP-004';
