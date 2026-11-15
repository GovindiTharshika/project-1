import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export default function Cart({ onNavigate }) {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, tax, total } = useCart();
  const { showToast } = useToast();
  const [notes, setNotes] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setOrdering(true);
    setError('');

    try {
      const res = await api.createOrder({
        items: cart.map(c => ({
          productId: c.productId,
          name: c.name,
          price: c.price,
          qty: c.qty
        })),
        notes
      });

      setOrderResult(res);
      clearCart();
      showToast(`Order placed successfully! Linked invoice generated on Net-14 terms.`, 'success', 'Order Confirmed', 5000);
    } catch (err) {
      setError(err.message || 'Failed to place order');
      showToast(err.message || 'Failed to place order', 'error', 'Checkout Failed');
    } finally {
      setOrdering(false);
    }
  };

  if (orderResult) {
    return (
      <div className="card" style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>🎉</div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: 8 }}>
          Purchase Order Placed Successfully!
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
          Order ID: <strong>{orderResult.order?.id}</strong> has been logged and sent to warehouse fulfillment.
        </p>

        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, textAlign: 'left', marginBottom: 24 }}>
          <div style={{ fontSize: '0.9rem', marginBottom: 6 }}>
            <strong>Generated Invoice:</strong> {orderResult.invoice?.id}
          </div>
          <div style={{ fontSize: '0.9rem', marginBottom: 6 }}>
            <strong>Total Amount:</strong> ${parseFloat(orderResult.order?.total).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.9rem' }}>
            <strong>Payment Terms:</strong> Net-14 (Due: {orderResult.invoice?.due})
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={() => { setOrderResult(null); onNavigate('catalog'); }}>
            Continue Ordering
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('orders')}>
            View My Orders →
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 500, margin: '40px auto' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>🛒</div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>Your Procurement Cart is Empty</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
          Select products from our wholesale catalog to begin an order.
        </p>
        <button className="btn btn-primary" onClick={() => onNavigate('catalog')}>
          Browse Catalog →
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>🛒 Procurement Cart</h2>
        <p style={{ color: 'var(--text-muted)' }}>Review line items and terms before submitting purchase order</p>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <div className="two-col">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Line Items ({cart.length})</h3>
            <button className="btn btn-outline btn-sm" onClick={clearCart}>
              Clear All
            </button>
          </div>

          <div>
            {cart.map(item => (
              <div
                key={item.productId}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
                  borderBottom: '1px solid var(--border)'
                }}
              >
                <div style={{ fontSize: '2rem' }}>{item.emoji || '📦'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ${parseFloat(item.price).toFixed(2)} / unit
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => updateQuantity(item.productId, -1)}>
                    −
                  </button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                  <button className="btn btn-outline btn-sm" onClick={() => updateQuantity(item.productId, 1)}>
                    +
                  </button>
                </div>

                <div style={{ fontWeight: 800, minWidth: 80, textAlign: 'right', color: 'var(--primary)' }}>
                  ${(item.price * item.qty).toFixed(2)}
                </div>

                <button
                  className="btn btn-outline btn-sm"
                  style={{ color: 'var(--danger)', border: 'none' }}
                  onClick={() => removeFromCart(item.productId)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
              Special Delivery Instructions / PO Reference
            </label>
            <textarea
              placeholder="e.g. Deliver to Loading Bay 2; Attn: Warehouse Reception"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border)' }}
            />
          </div>
        </div>

        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Purchase Summary</h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Items Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Estimated Commercial Tax (10%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
            <span>Order Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 20 }}>
            ℹ️ Submitting this order generates an authorized invoice on Net-14 settlement terms. Warehouse stock is decremented immediately.
          </div>

          <button
            className="btn btn-success"
            style={{ width: '100%', padding: 14, fontSize: '1rem' }}
            disabled={ordering}
            onClick={handleCheckout}
          >
            {ordering ? 'Processing Order...' : '✅ Confirm & Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

