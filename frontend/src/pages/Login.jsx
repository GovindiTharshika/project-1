import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, register, loading } = useAuth();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('admin@b2b.com');
  const [password, setPassword] = useState('admin123');

  // Registration state
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('customer');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (!res.success) {
      setError(res.error || 'Authentication failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register({ name, email: regEmail, company, role, password: regPassword });
    if (!res.success) {
      setError(res.error || 'Registration failed');
    }
  };

  const quickDemo = (em, pass) => {
    setEmail(em);
    setPassword(pass);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a56db 0%, #0e9f6e 100%)', padding: 20
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '40px 48px', width: '100%', maxWidth: 440,
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
            🏢 B2B OrderHub
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            Arrowstack Internship — React & NestJS Stack
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button
            className={`btn ${tab === 'login' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            className={`btn ${tab === 'register' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2', color: '#991b1b', padding: '10px 14px',
            borderRadius: 8, fontSize: '0.85rem', marginBottom: 16
          }}>
            {error}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--border)' }}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--border)' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 12 }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In with JWT'}
            </button>

            <div style={{ marginTop: 22, background: '#f8fafc', padding: 12, borderRadius: 8, fontSize: '0.78rem' }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Quick Demo Credentials:</div>
              <div style={{ cursor: 'pointer', color: 'var(--primary)', marginBottom: 3 }} onClick={() => quickDemo('admin@b2b.com', 'admin123')}>
                🔑 <strong>Admin:</strong> admin@b2b.com (Full Control)
              </div>
              <div style={{ cursor: 'pointer', color: 'var(--primary)', marginBottom: 3 }} onClick={() => quickDemo('sales@b2b.com', 'sales123')}>
                🔑 <strong>Sales Rep:</strong> sales@b2b.com (Fulfillment)
              </div>
              <div style={{ cursor: 'pointer', color: 'var(--primary)', marginBottom: 3 }} onClick={() => quickDemo('warehouse@b2b.com', 'warehouse123')}>
                🔑 <strong>Warehouse:</strong> warehouse@b2b.com (Inventory & Dispatch)
              </div>
              <div style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => quickDemo('buyer@b2b.com', 'buyer123')}>
                🔑 <strong>Customer:</strong> buyer@b2b.com (Ordering)
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)' }} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Email Address</label>
              <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)' }} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Company Organization</label>
              <input type="text" value={company} onChange={e => setCompany(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)' }} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>System Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)' }}>
                <option value="customer">Wholesale Customer / Buyer</option>
                <option value="sales">Sales Representative</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Password</label>
              <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 12 }} disabled={loading}>
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

