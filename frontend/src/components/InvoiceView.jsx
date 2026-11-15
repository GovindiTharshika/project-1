import React from 'react';

export default function InvoiceView({ invoice, order, onBack, onMarkPaid, isAdmin }) {
  if (!invoice) return null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button className="btn btn-outline" onClick={onBack}>
          ← Back to Invoices
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          {isAdmin && invoice.status !== 'paid' && (
            <button className="btn btn-success" onClick={() => onMarkPaid(invoice.id)}>
              ✅ Mark as Paid
            </button>
          )}
          <button className="btn btn-primary" onClick={() => window.print()}>
            🖨️ Print Invoice
          </button>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 720, margin: '0 auto', padding: '36px 44px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)' }}>
              🏢 B2B<span style={{ color: 'var(--secondary)' }}>OrderHub</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Enterprise Wholesale Logistics Corp<br />
              100 Technology Park, Suite 400<br />
              billing@orderhub.corp
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>TAX INVOICE</h2>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{invoice.id}</div>
            <span className={`badge ${invoice.status === 'paid' ? 'badge-green' : invoice.status === 'overdue' ? 'badge-red' : 'badge-orange'}`}>
              Status: {invoice.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Billed To
            </div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>{invoice.customerName}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{invoice.company}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Invoice Schedule
            </div>
            <div style={{ fontSize: '0.88rem', marginTop: 4 }}>
              <strong>Issue Date:</strong> {invoice.issued}<br />
              <strong>Due Date:</strong> {invoice.due} (Net-14)
            </div>
          </div>
        </div>

        <table style={{ width: '100%', marginBottom: 24 }}>
          <thead>
            <tr>
              <th>Line Item</th>
              <th style={{ textAlign: 'right' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Unit Price</th>
              <th style={{ textAlign: 'right' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order && order.items ? (
              order.items.map((it, idx) => (
                <tr key={idx}>
                  <td>{it.name}</td>
                  <td style={{ textAlign: 'right' }}>{it.qty}</td>
                  <td style={{ textAlign: 'right' }}>${parseFloat(it.price).toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}>${(it.price * it.qty).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>Order line items available in linked order record</td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, borderTop: '2px solid var(--border)', paddingTop: 14 }}>
          <div style={{ display: 'flex', gap: 40, fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Commercial Tax (10%):</span>
            <span>${(invoice.amount * 0.1).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', gap: 40, fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
            <span>Total Payable:</span>
            <span>${parseFloat(invoice.amount).toFixed(2)}</span>
          </div>
        </div>

        <div style={{ marginTop: 36, textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          Thank you for choosing B2B OrderHub. For electronic ACH remittances, use routing ID #ACH-9820-221.
        </div>
      </div>
    </div>
  );
}

