import React from 'react';

export default function StatCard({ icon, label, value, color = 'blue', change, changeType = 'up' }) {
  const bgColors = {
    blue: '#ebf5ff',
    green: '#f0fdf4',
    orange: '#fff7ed',
    red: '#fef2f2'
  };

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
        background: bgColors[color] || bgColors.blue
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{value}</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{label}</div>
        {change && (
          <div style={{
            fontSize: '0.78rem', fontWeight: 600, marginTop: 2,
            color: changeType === 'up' ? 'var(--secondary)' : 'var(--danger)'
          }}>
            {changeType === 'up' ? '▲' : '▼'} {change}
          </div>
        )}
      </div>
    </div>
  );
}

