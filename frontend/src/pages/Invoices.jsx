import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import InvoiceView from '../components/InvoiceView';

export default function Invoices({ targetOrderId }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

  const loadData = async () => {
    try {
      const [invRes, ordRes] = await Promise.all([
        api.getInvoices(),
        api.getOrders()
      ]);
      const invList = invRes.data || [];
      const ordList = ordRes.data || [];
      setInvoices(invList);
      setOrders(ordList);

      if (targetOrderId) {
        const match = invList.find(i => i.orderId === targetOrderId);
        if (match) setSelectedInvoice(match);
      }
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [targetOrderId]);

  const handleMarkPaid = async (id) => {
    try {
      await api.markInvoicePaid(id);
      showToast(`Invoice ${id} marked as paid.`, 'success', 'Payment Recorded');
      loadData();
      if (selectedInvoice && selectedInvoice.id === id) {
        setSelectedInvoice(prev => ({ ...prev, status: 'paid' }));
      }
    } catch (err) {
      showToast(err.message, 'error', 'Payment Update Failed');
    }
  };

  if (selectedInvoice) {
    const linkedOrder = orders.find(o => o.id === selectedInvoice.orderId);
    return (
      <InvoiceView
        invoice={selectedInvoice}
        order={linkedOrder}
        isAdmin={isAdmin}
        onBack={() => setSelectedInvoice(null)}
        onMarkPaid={handleMarkPaid}
      />
    );
  }

  const filteredInvoices = statusFilter
    ? invoices.filter(i => i.status === statusFilter)
    : invoices;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>🧾 Billing & Tax Invoices</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Net-14 payment schedules and automated accounting documentation
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: '#fff' }}
        >
          <option value="">All Invoices</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading invoices...</div>
      ) : filteredInvoices.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>🧾</div>
          <h3>No invoices recorded</h3>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Order Reference</th>
                <th>Client / Account</th>
                <th>Amount Due</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(inv => (
                <tr key={inv.id}>
                  <td><strong>{inv.id}</strong></td>
                  <td>{inv.orderId}</td>
                  <td>{inv.customerName} ({inv.company})</td>
                  <td><strong>${parseFloat(inv.amount).toFixed(2)}</strong></td>
                  <td>{inv.due}</td>
                  <td>
                    <span className={`badge ${
                      inv.status === 'paid' ? 'badge-green' :
                      inv.status === 'overdue' ? 'badge-red' : 'badge-orange'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setSelectedInvoice(inv)}>
                        🧾 View & Print
                      </button>
                      {isAdmin && inv.status !== 'paid' && (
                        <button className="btn btn-success btn-sm" onClick={() => handleMarkPaid(inv.id)}>
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

