/**
 * ============================================================================
 * ORDERHUB B2B COMMERCE — OFFICIAL PRODUCT HOMEPAGE (REACT CLIENT)
 * Module: frontend/src/pages/Landing.jsx
 * Description: High-conversion enterprise commercial landing page for OrderHub B2B.
 * Highlights wholesale catalog workflows, real-time stock clamping, Net-14/30 invoicing,
 * multi-role workspace test drives, pricing tiers, and client case studies.
 * ============================================================================
 */

import React from 'react';

export default function Landing({ onGetStarted, onQuickLogin }) {
  return (
    <div style={{ background: '#ffffff', color: '#0f172a', minHeight: '100vh', fontFamily: 'inherit' }}>

      {/* -------------------------------------------------------------------- */}
      {/* 1. TOP SITE NAVIGATION                                               */}
      {/* -------------------------------------------------------------------- */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', padding: '16px 36px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span style={{ fontSize: '1.6rem' }}>🏢</span>
          <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
            OrderHub<span style={{ color: '#1a56db' }}>.b2b</span>
          </span>
        </div>

        {/* Navigation jump links */}
        <div style={{ display: 'flex', gap: 28, fontSize: '0.92rem', fontWeight: 600, color: '#64748b' }}>
          <a href="#solutions" style={{ textDecoration: 'none', color: 'inherit' }}>Solutions</a>
          <a href="#features" style={{ textDecoration: 'none', color: 'inherit' }}>Capabilities</a>
          <a href="#personas" style={{ textDecoration: 'none', color: 'inherit' }}>By Role</a>
          <a href="#pricing" style={{ textDecoration: 'none', color: 'inherit' }}>Pricing</a>
          <a href="#testimonials" style={{ textDecoration: 'none', color: 'inherit' }}>Case Studies</a>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onQuickLogin('admin@b2b.com', 'admin123')}
          >
            Sign In
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={onGetStarted}
          >
            Launch Live Demo →
          </button>
        </div>
      </nav>

      {/* -------------------------------------------------------------------- */}
      {/* 2. HERO SECTION                                                      */}
      {/* -------------------------------------------------------------------- */}
      <section style={{
        padding: '90px 24px 70px', textAlign: 'center', maxWidth: 1100, margin: '0 auto',
        background: 'radial-gradient(circle at 50% 10%, #ebf5ff 0%, #ffffff 70%)'
      }}>
        {/* Status Pill Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px',
          background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 30,
          color: '#1e40af', fontSize: '0.82rem', fontWeight: 700, marginBottom: 24
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0e9f6e' }}></span>
          OrderHub 2.0 Engine Live — Enterprise Wholesale Automation
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: '3.6rem', fontWeight: 900, lineHeight: 1.12, letterSpacing: '-0.035em',
          color: '#0f172a', marginBottom: 24
        }}>
          Modern Wholesale Commerce, Built for <span style={{
            background: 'linear-gradient(135deg, #1a56db 0%, #0e9f6e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Global Distributors</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.2rem', color: '#64748b', lineHeight: 1.6, maxWidth: 780,
          margin: '0 auto 38px'
        }}>
          Automate purchase orders, multi-warehouse inventory allocation, dynamic price tiers,
          and Net-14 commercial invoicing — all in one unified, high-performance platform.
        </p>

        {/* Hero CTAs */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
          <button
            className="btn btn-primary"
            style={{ padding: '15px 32px', fontSize: '1.05rem', borderRadius: 10, boxShadow: '0 4px 14px rgba(26, 86, 219, 0.3)' }}
            onClick={onGetStarted}
          >
            🚀 Launch Live Platform
          </button>
          <button
            className="btn btn-outline"
            style={{ padding: '15px 26px', fontSize: '1.05rem', borderRadius: 10 }}
            onClick={() => onQuickLogin('sales@b2b.com', 'sales123')}
          >
            💼 Sales Operator Workspace
          </button>
          <button
            className="btn btn-outline"
            style={{ padding: '15px 26px', fontSize: '1.05rem', borderRadius: 10 }}
            onClick={() => onQuickLogin('buyer@b2b.com', 'buyer123')}
          >
            🛒 Wholesale Buyer Workspace
          </button>
        </div>

        {/* Live Operational Metrics Card */}
        <div className="card" style={{
          padding: 28, maxWidth: 1040, margin: '0 auto', boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
          textAlign: 'left', border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}></span>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }}></span>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }}></span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', marginLeft: 8 }}>OrderHub Operational Center — Live Stream</span>
            </div>
            <span className="badge badge-green">Engine Online (99.99% Uptime)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 20 }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>ACTIVE GMV VOLUME</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a56db' }}>$1,489,200</div>
              <div style={{ fontSize: '0.78rem', color: '#0e9f6e', fontWeight: 600 }}>▲ 24.8% this quarter</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>ORDER FULFILLMENT RATE</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>99.8%</div>
              <div style={{ fontSize: '0.78rem', color: '#0e9f6e', fontWeight: 600 }}>Zero stock-out oversells</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>INVOICE BILLING LAG</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0e9f6e' }}>0.0 Sec</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Instant Net-14 generation</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>API TRANSACTION SPEED</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#7e22ce' }}>42 ms</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Real-time DB synchronization</div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 3. CLIENT TRUST STRIP                                                */}
      {/* -------------------------------------------------------------------- */}
      <section style={{
        padding: '36px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0',
        background: '#fafbfc', textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.08em', marginBottom: 18 }}>
          Trusted by Leading Wholesale Distributors & Global Supply Chains
        </div>
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 48,
          flexWrap: 'wrap', opacity: 0.7
        }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#334155' }}>🌐 NEXUS GLOBAL</span>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#334155' }}>📦 TECHVENTURES LOGISTICS</span>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#334155' }}>⚡ APEX SUPPLY CORP</span>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#334155' }}>🏭 HORIZON DISTRIBUTORS</span>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#334155' }}>🏢 OMNIWHOLESALE</span>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 4. PLATFORM CAPABILITIES                                             */}
      {/* -------------------------------------------------------------------- */}
      <section id="features" style={{ padding: '90px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: '#1a56db', letterSpacing: '0.08em', marginBottom: 8 }}>
              Full-Stack Commerce Capabilities
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a' }}>
              Everything You Need to Scale Wholesale Operations
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: 640, margin: '12px auto 0' }}>
              From catalog management to warehouse dispatch and invoice settlement, OrderHub streamlines every touchpoint.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
            {[
              {
                icon: '🛡️', bg: '#ebf5ff',
                title: 'Role-Based Access Control (RBAC)',
                desc: 'Granular cryptographic JWT session protection. Differentiate portals for wholesale buyers, regional sales reps, and warehouse operations leads with tailored views.'
              },
              {
                icon: '📦', bg: '#f0fdf4',
                title: 'Real-Time Inventory & Stock Clamping',
                desc: 'Live warehouse stock levels. Intelligent quantity clamping prevents over-ordering, low-stock threshold badges notify buyers, and out-of-stock items lock automatically.'
              },
              {
                icon: '🧾', bg: '#fff7ed',
                title: 'Automated Net-14/30 Invoicing',
                desc: 'Instant generation of authorized commercial tax invoices upon order confirmation. Line items, 10% tax breakdown, payment deadlines, and printable PDF documents.'
              },
              {
                icon: '🔄', bg: '#faf5ff',
                title: 'Order Lifecycle Fulfillment',
                desc: 'Transition orders smoothly from Pending Review ➔ Confirmed ➔ Processing ➔ Shipped with carrier tracking ➔ Delivered, keeping stakeholders informed in real-time.'
              },
              {
                icon: '📝', bg: '#fef2f2',
                title: 'Immutable Compliance Audit Trail',
                desc: 'Every user sign-in, price adjustment, inventory override, and status update is immutably timestamped and recorded for regulatory compliance and dispute resolution.'
              },
              {
                icon: '🔌', bg: '#f1f5f9',
                title: 'High-Throughput REST API',
                desc: 'Built for ERP and warehouse management integrations (WMS). Fast, standardized JSON endpoints for products, orders, invoices, and automated webhooks.'
              }
            ].map((f, i) => (
              <div key={i} className="card" style={{ padding: 32, border: '1px solid #e2e8f0', borderRadius: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 12, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.6rem', marginBottom: 20, background: f.bg
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 5. ROLE PERSONAS SECTION                                             */}
      {/* -------------------------------------------------------------------- */}
      <section id="personas" style={{ padding: '90px 24px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: '#1a56db', letterSpacing: '0.08em', marginBottom: 8 }}>
              Role-Based Experiences
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a' }}>
              Built for Every Member of Your Commerce Ecosystem
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: 600, margin: '12px auto 0' }}>
              Select any persona below to launch straight into an authenticated interactive environment.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
            {/* Admin Persona */}
            <div className="card" style={{ borderTop: '4px solid #e02424', padding: 32, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '2.2rem' }}>👑</span>
                <span className="badge badge-red">Distributor Operations</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>Platform Administrator</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, marginBottom: 20, flex: 1 }}>
                Manage wholesale SKU pricing, adjust warehouse inventory levels, monitor revenue graphs, approve customer credit terms, and oversee the immutable compliance log.
              </p>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 8, fontSize: '0.8rem', marginBottom: 20 }}>
                <strong>Demo Account:</strong> admin@b2b.com<br />
                <strong>Password:</strong> admin123
              </div>
              <button
                className="btn btn-outline"
                style={{ width: '100%' }}
                onClick={() => onQuickLogin('admin@b2b.com', 'admin123')}
              >
                Launch Admin Workspace →
              </button>
            </div>

            {/* Sales Persona */}
            <div className="card" style={{ borderTop: '4px solid #1a56db', padding: 32, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '2.2rem' }}>💼</span>
                <span className="badge badge-blue">Sales & Fulfillment</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>Sales Representative</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, marginBottom: 20, flex: 1 }}>
                Track incoming client orders, review order line-items, update fulfillment states from Confirmed to Shipped, and review client payment status.
              </p>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 8, fontSize: '0.8rem', marginBottom: 20 }}>
                <strong>Demo Account:</strong> sales@b2b.com<br />
                <strong>Password:</strong> sales123
              </div>
              <button
                className="btn btn-outline"
                style={{ width: '100%' }}
                onClick={() => onQuickLogin('sales@b2b.com', 'sales123')}
              >
                Launch Sales Workspace →
              </button>
            </div>

            {/* Buyer Persona */}
            <div className="card" style={{ borderTop: '4px solid #0e9f6e', padding: 32, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '2.2rem' }}>🛒</span>
                <span className="badge badge-green">Client Procurement</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>Wholesale Buyer</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, marginBottom: 20, flex: 1 }}>
                Browse catalog products with live stock availability, build volume carts with stock limits, submit purchase orders, and download printable tax invoices.
              </p>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 8, fontSize: '0.8rem', marginBottom: 20 }}>
                <strong>Demo Account:</strong> buyer@b2b.com<br />
                <strong>Password:</strong> buyer123
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => onQuickLogin('buyer@b2b.com', 'buyer123')}
              >
                Launch Buyer Workspace →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 6. PRICING TIERS                                                     */}
      {/* -------------------------------------------------------------------- */}
      <section id="pricing" style={{ padding: '90px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: '#1a56db', letterSpacing: '0.08em', marginBottom: 8 }}>
              Commercial Tiers
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a' }}>
              Transparent Plans for Growing Wholesale Networks
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            <div className="card" style={{ padding: 32 }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>Standard Distributor</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: 16 }}>$299 <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 400 }}>/ month</span></div>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: 24 }}>Ideal for emerging distributors handling up to 5,000 monthly orders.</p>
              <ul style={{ fontSize: '0.88rem', lineHeight: 2, marginBottom: 28, paddingLeft: 20, color: '#334155' }}>
                <li>Unlimited wholesale catalog SKUs</li>
                <li>Real-time stock clamping engine</li>
                <li>Automated Net-14 commercial invoices</li>
                <li>Role-based access (Up to 5 operators)</li>
              </ul>
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={onGetStarted}>Get Started</button>
            </div>

            <div className="card" style={{ padding: 32, border: '2px solid #1a56db', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, right: 24, background: '#1a56db', color: '#fff', padding: '2px 12px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700 }}>MOST POPULAR</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>Scale Enterprise</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: 16, color: '#1a56db' }}>$799 <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 400 }}>/ month</span></div>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: 24 }}>Designed for regional distributors with high-volume procurement teams.</p>
              <ul style={{ fontSize: '0.88rem', lineHeight: 2, marginBottom: 28, paddingLeft: 20, color: '#334155' }}>
                <li>Everything in Standard</li>
                <li>Multi-warehouse inventory routing</li>
                <li>Immutable regulatory audit trail</li>
                <li>High-throughput REST API integrations</li>
                <li>24/7 dedicated logistics support</li>
              </ul>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={onGetStarted}>Start Enterprise Demo</button>
            </div>

            <div className="card" style={{ padding: 32 }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>Custom Global</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: 16 }}>Custom</div>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: 24 }}>Dedicated infrastructure, on-premise PostgreSQL, and custom ERP connectors.</p>
              <ul style={{ fontSize: '0.88rem', lineHeight: 2, marginBottom: 28, paddingLeft: 20, color: '#334155' }}>
                <li>Unlimited operators and buyers</li>
                <li>Custom ERP connectors (SAP, NetSuite)</li>
                <li>Custom Net-30/60/90 terms engine</li>
                <li>99.99% SLA guarantee</li>
              </ul>
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={onGetStarted}>Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 7. CUSTOMER CASE STUDIES                                             */}
      {/* -------------------------------------------------------------------- */}
      <section id="testimonials" style={{ padding: '90px 24px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: '#1a56db', letterSpacing: '0.08em', marginBottom: 8 }}>
              Verified Case Studies
            </div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 900, color: '#0f172a' }}>
              Proven Results Across Wholesale Distribution
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
            <div className="card" style={{ padding: 28 }}>
              <div style={{ color: '#f59e0b', fontSize: '1.2rem', margin: '0 0 12px' }}>★★★★★</div>
              <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, marginBottom: 20 }}>
                "OrderHub cut our order entry errors to zero. Our buyers place orders directly against live warehouse stock, and invoices are generated automatically with exact Net-14 terms."
              </p>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>David Vance</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>VP of Operations, TechVentures Logistics</div>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <div style={{ color: '#f59e0b', fontSize: '1.2rem', margin: '0 0 12px' }}>★★★★★</div>
              <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, marginBottom: 20 }}>
                "The role-based security is flawless. Our field sales reps update fulfillment without seeing financial settlement records, while management has a unified view of accounts receivable."
              </p>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Elena Rostova</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Commercial Director, Nexus Supply Solutions</div>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <div style={{ color: '#f59e0b', fontSize: '1.2rem', margin: '0 0 12px' }}>★★★★★</div>
              <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, marginBottom: 20 }}>
                "We migrated to OrderHub and had our entire 10,000+ SKU catalog and warehouse staff operational in under 48 hours. The REST API and audit logging give us complete peace of mind."
              </p>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Marcus Thorne</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Chief Supply Officer, Apex Global Trade</div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 8. FOOTER                                                            */}
      {/* -------------------------------------------------------------------- */}
      <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '64px 24px 36px', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: '1.8rem' }}>🏢</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>OrderHub<span style={{ color: '#0e9f6e' }}>.b2b</span></span>
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#64748b' }}>
                The next-generation B2B wholesale commerce, inventory allocation, and automated commercial billing platform.
              </p>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: 16, textTransform: 'uppercase' }}>Product</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem' }}>
                <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Inventory Clamping</a>
                <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Net-14 Invoicing</a>
                <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>RBAC Permissions</a>
                <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Audit Trail</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: 16, textTransform: 'uppercase' }}>Solutions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem' }}>
                <a href="#personas" style={{ color: 'inherit', textDecoration: 'none' }}>For Distributors</a>
                <a href="#personas" style={{ color: 'inherit', textDecoration: 'none' }}>For Field Sales</a>
                <a href="#personas" style={{ color: 'inherit', textDecoration: 'none' }}>For Wholesale Buyers</a>
                <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Commercial Pricing</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: 16, textTransform: 'uppercase' }}>Enterprise</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem' }}>
                <span>SOC2 Type II Certified</span>
                <span>GDPR / CCPA Ready</span>
                <span>256-Bit SSL Encryption</span>
                <span>99.99% SLA Uptime</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1e293b', paddingTop: 24, fontSize: '0.8rem', color: '#64748b', flexWrap: 'wrap', gap: 14 }}>
            <div>© 2026 OrderHub B2B Technologies Inc. All rights reserved.</div>
            <div style={{ display: 'flex', gap: 20 }}>
              <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
              <span style={{ cursor: 'pointer' }}>Terms of Service</span>
              <span style={{ cursor: 'pointer' }}>Security Architecture</span>
              <span style={{ cursor: 'pointer' }}>System Status</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
