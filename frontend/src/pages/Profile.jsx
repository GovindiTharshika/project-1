import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>👤 User Profile</h2>
        <p style={{ color: 'var(--text-muted)' }}>Authenticated JWT account session details</p>
      </div>

      <div className="two-col">
        <div className="card">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20,
            paddingBottom: 20, borderBottom: '1px solid var(--border)'
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%', background: 'var(--primary)',
              color: '#fff', fontSize: '1.6rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {user.name ? user.name[0] : 'U'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{user.name}</h3>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{user.company}</div>
              <span className="badge badge-blue" style={{ marginTop: 4 }}>
                Role: {user.role.toUpperCase()}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Registered Email:</span>
              <strong>{user.email}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>User Identification:</span>
              <strong>#{user.id || user.sub}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Security Protocol:</span>
              <span>HMAC-SHA256 JWT Bearer Token</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Enterprise Guidelines</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            B2B OrderHub employs Role-Based Access Control (RBAC). Your assigned privileges determine catalog pricing tiers, purchase approval workflows, and warehouse fulfillment capabilities.
          </p>
          <div style={{ marginTop: 20, background: '#f8fafc', padding: 14, borderRadius: 8, fontSize: '0.82rem' }}>
            <strong>Active Policy:</strong>
            <ul style={{ paddingLeft: 18, marginTop: 6, lineHeight: 1.5 }}>
              <li>Orders placed undergo automated stock verification.</li>
              <li>Linked invoices generated with standard Net-14 payment schedules.</li>
              <li>Audit logs record session activities for compliance review.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

