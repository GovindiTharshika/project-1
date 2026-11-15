/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: frontend/src/App.jsx
 * Description: Master Application Container Component
 * Coordinates routing between Landing Page, Multi-Role Login, Executive
 * Dashboard, Product Catalog, Procurement Cart, Order Management, Invoicing,
 * User Administration, Audit Logs, and Profile settings.
 * ============================================================================
 */

import React, { useState } from 'react';

// Authentication context hook
import { useAuth } from './context/AuthContext';

// Structural layout components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// View pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Invoices from './pages/Invoices';
import Users from './pages/Users';
import AuditLogs from './pages/AuditLogs';
import Profile from './pages/Profile';

export default function App() {
  // Extract authenticated user state and login handler from context
  const { user, login } = useAuth();

  // Active view state ('home', 'login', 'dashboard', 'catalog', 'cart', 'orders', 'invoices', 'users', 'audit', 'profile')
  const [currentPage, setCurrentPage] = useState('home');

  // Track target order ID when navigating directly to linked invoice
  const [targetOrderId, setTargetOrderId] = useState(null);

  /**
   * Navigates to a designated view page and resets auxiliary scroll and query state
   * @param {string} page - Target page key
   */
  const handleNavigate = (page) => {
    setCurrentPage(page);
    setTargetOrderId(null);
    window.scrollTo(0, 0);
  };

  /**
   * One-click login helper from the Landing Page
   * @param {string} email - Demo user email
   * @param {string} password - Demo user password
   */
  const handleQuickLogin = async (email, password) => {
    const res = await login(email, password);
    if (res.success) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('login');
    }
  };

  /**
   * Drills down into the invoice view linked to a specific purchase order
   * @param {string} orderId - Originating order identifier (e.g. 'ORD-001')
   */
  const handleViewInvoiceForOrder = (orderId) => {
    setTargetOrderId(orderId);
    setCurrentPage('invoices');
    window.scrollTo(0, 0);
  };

  // --------------------------------------------------------------------------
  // SCENARIO 1: User is on the Landing / Home Page
  // --------------------------------------------------------------------------
  if (currentPage === 'home') {
    return (
      <Landing
        onGetStarted={() => setCurrentPage(user ? 'dashboard' : 'login')}
        onQuickLogin={handleQuickLogin}
      />
    );
  }

  // --------------------------------------------------------------------------
  // SCENARIO 2: Unauthenticated user accessing portal
  // --------------------------------------------------------------------------
  if (!user) {
    return (
      <div>
        <div style={{
          position: 'fixed', top: 16, left: 16, zIndex: 110
        }}>
          <button
            className="btn btn-outline btn-sm"
            style={{ background: '#fff' }}
            onClick={() => setCurrentPage('home')}
          >
            ← Back to Home Page
          </button>
        </div>
        <Login />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // SCENARIO 3: Authenticated user in the portal workspace
  // --------------------------------------------------------------------------
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'catalog':
        return <Catalog />;
      case 'cart':
        return <Cart onNavigate={handleNavigate} />;
      case 'orders':
        return <Orders onViewInvoice={handleViewInvoiceForOrder} />;
      case 'invoices':
        return <Invoices targetOrderId={targetOrderId} />;
      case 'users':
        return <Users />;
      case 'audit':
        return <AuditLogs />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Application Header */}
      <Navbar onNavigate={handleNavigate} onGoHome={() => setCurrentPage('home')} />

      {/* Main Layout: Fixed Sidebar + Scrollable Content Body */}
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} onGoHome={() => setCurrentPage('home')} />
        <main style={{
          marginLeft: 'var(--sidebar-w)',
          marginTop: 'var(--header-h)',
          padding: 32,
          flex: 1,
          maxWidth: 1400
        }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
