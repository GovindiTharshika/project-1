import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product, onEditStock }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const isCustomer = user?.role === 'customer';
  const isAdmin = user?.role === 'admin';

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= product.minStock;

  const handleAdd = () => {
    const res = addToCart(product, qty);
    if (res && res.success === false) {
      showToast(res.message || 'Cannot add out-of-stock item', 'warning', 'Inventory Notice');
      return;
    }
    showToast(`Added ${qty}x ${product.name} to procurement cart`, 'success', 'Cart Updated');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>
      <div style={{
        height: 130, background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.2rem'
      }}>
        {product.emoji || '📦'}
      </div>

      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{product.name}</h4>
          {isOutOfStock ? (
            <span className="badge badge-red">Out of Stock</span>
          ) : isLowStock ? (
            <span className="badge badge-orange">Low: {product.stock} left</span>
          ) : (
            <span className="badge badge-green">In Stock: {product.stock}</span>
          )}
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>
          SKU: {product.sku} · {product.category}
        </div>

        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>
          ${parseFloat(product.price).toFixed(2)}
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}> / unit</span>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flex: 1, marginBottom: 14 }}>
          {product.description}
        </p>

        {isCustomer && !isOutOfStock && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                −
              </button>
              <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{qty}</span>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
              >
                +
              </button>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>max {product.stock}</span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={handleAdd}
            >
              {added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
            </button>
          </div>
        )}

        {isAdmin && (
          <button
            className="btn btn-outline btn-sm"
            style={{ width: '100%', marginTop: 'auto' }}
            onClick={() => onEditStock(product)}
          >
            ✏️ Update Stock Level
          </button>
        )}
      </div>
    </div>
  );
}

