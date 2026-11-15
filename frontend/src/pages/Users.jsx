import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export default function Users() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const res = await api.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggle = async (userId) => {
    try {
      await api.toggleUserStatus(userId);
      showToast(`User status toggled successfully.`, 'success', 'User Updated');
      loadUsers();
    } catch (err) {
      showToast(err.message, 'error', 'Status Update Failed');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>👥 User & Access Management</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage wholesale accounts, sales operator privileges, and system roles
        </p>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading user directory...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email Address</th>
                <th>Organization</th>
                <th>System Role</th>
                <th>Account Status</th>
                <th>Member Since</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-light)',
                        color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {u.name[0]}
                      </div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.company}</td>
                  <td>
                    <span className={`badge ${
                      u.role === 'admin' ? 'badge-red' :
                      u.role === 'sales' ? 'badge-blue' : 'badge-green'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>{u.joined}</td>
                  <td>
                    {user?.sub !== u.id ? (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleToggle(u.id)}
                      >
                        {u.status === 'active' ? '🚫 Deactivate' : '✅ Activate'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current User</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

