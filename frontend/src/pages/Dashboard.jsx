import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatCard from '../components/StatCard';

export default function Dashboard({ onNavigate }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ordRes, invRes, prodRes] = await Promise.all([
          api.getOrders(),
          api.getInvoices(),
          api.getProducts()
        ]);
        setOrders(ordRes.data || []);
        setInvoices(invRes.data || []);
        setProducts(prodRes.data || []);

        if (user.role === 'admin' || user.role === 'sales') {
          const logRes = await api.getAuditLogs();
          setAuditLogs((logRes.data || []).slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading enterprise analytics...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>📊 Executive Dashboard</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Welcome back, {user.name} ({user.company})
        </p>
      </div>

      <div className="stat-grid">
        <StatCard
          icon="📦"
          label={user.role === 'customer' ? 'My Placed Orders' : 'Total Orders'}
          value={orders.length}
          color="blue"
          change="Real-time synchronized"
        />
        <StatCard
          icon="💰"
          label={user.role === 'customer' ? 'Total Spent' : 'Gross Volume'}
          value={`$${totalRevenue.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          color="green"
          change="10% Commercial Tax applied"
        />
        <StatCard
          icon="⏳"
          label="Pending Fulfillment"
          value={pendingOrders}
          color="orange"
          change={pendingOrders > 0 ? 'Requires action' : 'Fulfillment up to date'}
          changeType={pendingOrders > 0 ? 'down' : 'up'}
        />
        <StatCard
          icon="🧾"
          label="Overdue Invoices"
          value={overdueInvoices}
          color="red"
          change={overdueInvoices > 0 ? 'Payment reminder needed' : 'All clear'}
          changeType={overdueInvoices > 0 ? 'down' : 'up'}
        />
      </div>

      <div className="two-col" style={{ marginBottom: 24 }}>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 14 }}>📈 Weekly Volume Simulation</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120, padding: '10px 0' }}>
            {[45, 78, 62, 95, 88, 70, 110].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${(h / 110) * 100}%`,
                  background: i === 6 ? 'var(--secondary)' : 'var(--primary)',
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.85
                }}
                title={`$${h * 150}`}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 14 }}>🕒 Recent Activity & Audit</div>
          {auditLogs.length > 0 ? (
            auditLogs.map(l => (
              <div key={l.id} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginTop: 6 }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{l.msg}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.actor} · {l.time?.slice(0, 19).replace('T', ' ')}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No audit events to display.</div>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>📦 Recent Orders</h3>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigate('orders')}>
            View All Orders →
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client / Company</th>
                <th>Line Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(o => (
                <tr key={o.id}>
                  <td><strong>{o.id}</strong></td>
                  <td>{o.customerName} ({o.company})</td>
                  <td>{o.items?.length || 0} items</td>
                  <td><strong>${parseFloat(o.total).toFixed(2)}</strong></td>
                  <td>
                    <span className={`badge ${
                      o.status === 'delivered' ? 'badge-green' :
                      o.status === 'shipped' ? 'badge-blue' :
                      o.status === 'cancelled' ? 'badge-red' : 'badge-orange'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

