import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      const res = await api.getAuditLogs({ type: filterType, search });
      setLogs(res.data || []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [filterType, search]);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>📝 Immutable Compliance Audit Trail</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Traceability logs capturing state changes, authentication events, orders, and pricing modifications
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="🔍 Search audit messages or actor names..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--border)' }}
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: '#fff' }}
        >
          <option value="">All Event Types</option>
          <option value="auth">Authentication</option>
          <option value="order">Order Processing</option>
          <option value="product">Product & Stock</option>
          <option value="invoice">Invoicing</option>
          <option value="user">User Management</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading audit records...</div>
      ) : (
        <div className="card">
          {logs.map(log => (
            <div
              key={log.id}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0',
                borderBottom: '1px solid var(--border)'
              }}
            >
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: log.color === 'green' ? 'var(--secondary)' : log.color === 'red' ? 'var(--danger)' : 'var(--primary)',
                marginTop: 6
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{log.msg}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  <span className="badge badge-gray">{log.type}</span> · Actor: <strong>{log.actor}</strong> · {log.time?.replace('T', ' ').slice(0, 19)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

