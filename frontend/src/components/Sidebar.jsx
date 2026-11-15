/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: frontend/src/components/Sidebar.jsx
 * Description: Lateral Navigation Drawer Component
 * Renders role-aware navigation links for Dashboard, Catalog, Cart, Orders,
 * Invoices, Users, Audit Trail, and Profile.
 * ============================================================================
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Sidebar({ currentPage, onNavigate, onGoHome }) {
  // Extract authenticated user profile
  const { user } = useAuth();

  // Extract real-time cart item count for badge rendering
  const { itemCount } = useCart();

  // Role booleans
  const isCustomer = user?.role === 'customer';
  const isAdminOrSales = user?.role === 'admin' || user?.role === 'sales';

  /**
   * Helper function to render a styled navigation menu item
   * @param {string} page - Target page key
   * @param {string} icon - Visual icon emoji
   * @param {string} label - Display text
   * @param {number} [badge] - Optional notification count
   */
  const navItem = (page, icon, label, badge) => {
    const active = currentPage === page;
    return (
      <div
        onClick={() => onNavigate(page)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px',
          cursor: 'pointer', transition: 'all 0.15s',
          background: active ? 'var(--primary-light)' : 'transparent',
          color: active ? 'var(--primary)' : 'var(--text-muted)',
          borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
          fontWeight: active ? 600 : 500,
          fontSize: '0.9rem'
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <span style={{ flex: 1 }}>{label}</span>
        {badge !== undefined && badge > 0 && (
          <span style={{
            background: 'var(--primary)', color: '#fff', borderRadius: 20,
            padding: '1px 8px', fontSize: '0.72rem', fontWeight: 700
          }}>
            {badge}
          </span>
        )}
      </div>
    );
  };

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 'var(--header-h)', bottom: 0, width: 'var(--sidebar-w)',
      background: '#fff', borderRight: '1px solid var(--border)', overflowY: 'auto', zIndex: 90,
      padding: '16px 0'
    }}>
      {/* Overview Section */}
      <div style={{
        padding: '8px 20px 4px', fontSize: '0.72rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)'
      }}>
        Overview
      </div>
      <div
        onClick={onGoHome}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px',
          cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>🏠</span>
        <span>Home Page</span>
      </div>

      {/* Operations Section */}
      <div style={{
        padding: '16px 20px 4px', fontSize: '0.72rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)'
      }}>
        Operations
      </div>
      {navItem('dashboard', '📊', 'Dashboard')}
      {navItem('catalog', '📦', 'Catalog')}
      {isCustomer && navItem('cart', '🛒', 'Cart', itemCount)}
      {navItem('orders', '📋', 'Orders')}
      {navItem('invoices', '🧾', 'Invoices')}

      {/* Administrative Section (Restricted to Admin & Sales) */}
      {isAdminOrSales && (
        <>
          <div style={{
            padding: '20px 20px 4px', fontSize: '0.72rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)'
          }}>
            Management
          </div>
          {user.role === 'admin' && navItem('users', '👥', 'User Accounts')}
          {navItem('audit', '📝', 'Audit Trail')}
        </>
      )}

      {/* Account Section */}
      <div style={{
        padding: '20px 20px 4px', fontSize: '0.72rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)'
      }}>
        Account
      </div>
      {navItem('profile', '👤', 'My Profile')}
    </aside>
  );
}
