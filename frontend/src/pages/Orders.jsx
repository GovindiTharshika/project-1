import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export default function Orders({ onViewInvoice }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const isAdminOrSales = user?.role === 'admin' || user?.role === 'sales';

  const loadOrders = async () => {
    try {
      const res = await api.getOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showToast(`Order ${orderId} status updated to ${newStatus.toUpperCase()}`, 'success', 'Status Updated');
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      showToast(err.message, 'error', 'Status Update Failed');
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter(o => o.status === statusFilter)
    : orders;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>📋 Purchase Orders</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {user.role === 'customer'
              ? 'Track the fulfillment and shipping progress of your orders'
              : 'Manage warehouse fulfillment and advance order lifecycles'}
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: '#fff' }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>📋</div>
          <h3>No orders found</h3>
          <p>Orders will appear here once placed</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client / Organization</th>
                <th>Items Count</th>
                <th>Order Total</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => (
                <tr key={o.id}>
                  <td><strong>{o.id}</strong></td>
                  <td>{o.customerName} ({o.company})</td>
                  <td>{o.items?.length || 0} line items</td>
                  <td><strong>${parseFloat(o.total).toFixed(2)}</strong></td>
                  <td>{o.date}</td>
                  <td>
                    {isAdminOrSales ? (
                      <select
                        value={o.status}
                        onChange={e => handleStatusChange(o.id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: '0.82rem' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className={`badge ${
                        o.status === 'delivered' ? 'badge-green' :
                        o.status === 'shipped' ? 'badge-blue' :
                        o.status === 'cancelled' ? 'badge-red' : 'badge-orange'
                      }`}>
                        {o.status}
                      </span>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => setSelectedOrder(o)}>
                      👁 View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card" style={{ width: '90%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>Order {selectedOrder.id} Details</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, fontSize: '0.88rem' }}>
              <div><strong>Client:</strong> {selectedOrder.customerName}</div>
              <div><strong>Company:</strong> {selectedOrder.company}</div>
              <div><strong>Date:</strong> {selectedOrder.date}</div>
              <div><strong>Status:</strong> {selectedOrder.status}</div>
            </div>

            {selectedOrder.notes && (
              <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, fontSize: '0.82rem', marginBottom: 16 }}>
                <strong>Instructions:</strong> {selectedOrder.notes}
              </div>
            )}

            <div style={{ fontWeight: 700, marginBottom: 8, fontSize: '0.9rem' }}>Items Ordered:</div>
            <table style={{ width: '100%', marginBottom: 16 }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th style={{ textAlign: 'right' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Price</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items?.map((it, idx) => (
                  <tr key={idx}>
                    <td>{it.name}</td>
                    <td style={{ textAlign: 'right' }}>{it.qty}</td>
                    <td style={{ textAlign: 'right' }}>${parseFloat(it.price).toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>${(it.price * it.qty).toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} style={{ fontWeight: 700 }}>Total (with tax):</td>
                  <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>
                    ${parseFloat(selectedOrder.total).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn btn-outline" onClick={() => setSelectedOrder(null)}>Close</button>
              {onViewInvoice && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const ordId = selectedOrder.id;
                    setSelectedOrder(null);
                    onViewInvoice(ordId);
                  }}
                >
                  🧾 View Linked Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

