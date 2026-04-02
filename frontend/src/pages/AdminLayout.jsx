import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminComplaints from './AdminComplaints';
import AdminUsers from './AdminUsers';

const TABS = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'complaints', icon: '📋', label: 'Complaints' },
  { key: 'users', icon: '👥', label: 'Users' },
];

export default function AdminLayout() {
  const [tab, setTab] = useState('dashboard');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ padding: '4px 12px 16px', borderBottom: '1px solid var(--gray200)', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray800)' }}>{user?.name}</div>
          <div style={{ fontSize: 12, color: 'var(--gray400)' }}>Administrator</div>
        </div>
        <div className="sidebar-section">Navigation</div>
        {TABS.map(({ key, icon, label }) => (
          <button key={key} className={`sidebar-link${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
            <span>{icon}</span> {label}
          </button>
        ))}
        <div className="sidebar-section" style={{ marginTop: 'auto' }}>Account</div>
        <button className="sidebar-link" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
          <span>🚪</span> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="admin-content">
        {tab === 'dashboard' && <AdminDashboard />}
        {tab === 'complaints' && <AdminComplaints />}
        {tab === 'users' && <AdminUsers />}
      </main>
    </div>
  );
}
