/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: frontend/src/components/Navbar.jsx
 * Description: Top Header Navigation Component
 * Displays application branding, Home link, user profile indicator,
 * role badge, and sign-out button.
 * ============================================================================
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNavigate, onGoHome }) {
  // Access authenticated user profile and logout action
  const { user, logout } = useAuth();

  /**
   * Translates short role strings into professional title labels
   * @param {string} role - 'admin' | 'sales' | 'customer'
   * @returns {string} Human-readable role title
   */
  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'sales': return 'Sales Representative';
      case 'customer': return 'Wholesale Buyer';
      default: return role;
    }
  };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 'var(--header-h)',
      background: '#fff', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 24px', zIndex: 100
    }}>
      {/* Brand logo & title */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={onGoHome}
        title="Return to Home / Landing Page"
      >
        <span style={{ fontSize: '1.4rem' }}>🏢</span>
        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
          B2B <span style={{ color: 'var(--secondary)' }}>OrderHub</span>
        </span>
      </div>

      {/* Home shortcut button */}
      <button
        className="btn btn-outline btn-sm"
        style={{ marginLeft: 20 }}
        onClick={onGoHome}
      >
        🏠 Home Page
      </button>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Authenticated user profile and session controls */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {getRoleLabel(user.role)} · {user.company}
            </div>
          </div>

          {/* User Avatar Circle */}
          <div style={{
            width: 38, height: 38, borderRadius: '50%', background: 'var(--primary)',
            color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>

          {/* Sign Out Button */}
          <button className="btn btn-outline btn-sm" onClick={logout}>
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
