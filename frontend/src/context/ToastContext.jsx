/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: frontend/src/context/ToastContext.jsx
 * Description: Global Toast Notification Context & Floating Renderer
 * Replaces native browser alert() dialogs ("localhost says") with elegant,
 * non-blocking enterprise toast notifications.
 * ============================================================================
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the Toast React Context
const ToastContext = createContext(null);

/**
 * Toast Provider Component
 * Wraps the application and renders floating toast notification banners
 * @param {object} props - Component props containing children
 */
export function ToastProvider({ children }) {
  // State storing the list of currently visible toast alerts
  const [toasts, setToasts] = useState([]);

  /**
   * Dispatches a new toast notification banner
   * @param {string} message - Notification message body
   * @param {'success'|'error'|'warning'|'info'} type - Visual styling type
   * @param {string} title - Optional title header
   * @param {number} duration - Auto-dismiss timeout in milliseconds
   */
  const showToast = useCallback((message, type = 'info', title = '', duration = 4000) => {
    // Generate a unique ID for this toast instance
    const id = Date.now() + Math.random().toString(36).substring(2, 9);

    // Append new toast to state
    setToasts((prev) => [...prev, { id, message, type, title }]);

    // Automatically remove toast after the designated duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  /**
   * Manually dismiss a toast by ID
   * @param {string} id - Toast identifier
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Icon dictionary for different notification types
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  // Border colors matching enterprise design tokens
  const borderColors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Floating Toast Container */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          pointerEvents: 'none'
        }}
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              minWidth: 320,
              maxWidth: 440,
              padding: '14px 18px',
              borderRadius: 12,
              background: '#0f172a',
              color: '#f8fafc',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.2)',
              borderLeft: `4px solid ${borderColors[toast.type] || '#3b82f6'}`,
              animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ fontSize: '1.25rem', lineHeight: 1 }}>{icons[toast.type] || 'ℹ️'}</div>
            <div style={{ flex: 1 }}>
              {toast.title && (
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 2 }}>{toast.title}</div>
              )}
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '1.2rem',
                lineHeight: 1,
                padding: 0
              }}
              title="Close"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Custom hook to access toast notification trigger
 * @returns {{ showToast: Function, removeToast: Function }}
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if invoked outside provider
    return {
      showToast: (msg) => console.log(`[Toast] ${msg}`),
      removeToast: () => {}
    };
  }
  return context;
}

