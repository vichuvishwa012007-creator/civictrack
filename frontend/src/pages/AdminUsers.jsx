import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/users').then(({ data }) => setUsers(data)).finally(() => setLoading(false));
  }, []);

  const handleToggle = async (user) => {
    try {
      await api.patch(`/users/${user.id}/toggle`);
      toast.success(`User ${user.is_active ? 'deactivated' : 'activated'}.`);
      setUsers((us) => us.map((u) => u.id === user.id ? { ...u, is_active: u.is_active ? 0 : 1 } : u));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Action failed.');
    }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header mb-3">
        <div>
          <div className="page-title">Registered Users</div>
          <div className="page-sub">{users.length} total citizens</div>
        </div>
      </div>

      <div className="search-box mb-3">
        <input className="search-input" placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="loading-page"><span className="spinner"></span></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Complaints</th><th>Joined</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--gray400)' }}>No users found</td></tr>
              ) : filtered.map((u, i) => (
                <tr key={u.id}>
                  <td style={{ fontSize: 12, color: 'var(--gray400)' }}>U-{String(u.id).padStart(3, '0')}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'var(--brand)', flexShrink: 0 }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--brand)' }}>{u.email}</td>
                  <td style={{ fontSize: 13 }}>{u.phone || '—'}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{u.complaint_count}</td>
                  <td style={{ fontSize: 12, color: 'var(--gray400)' }}>{formatDate(u.created_at)}</td>
                  <td>
                    <span className={`badge badge-${u.is_active ? 'active' : 'blocked'}`}>
                      {u.is_active ? '✅ Active' : '🚫 Blocked'}
                    </span>
                  </td>
                  <td>
                    {u.role !== 'admin' && (
                      <button
                        className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => handleToggle(u)}
                      >
                        {u.is_active ? 'Block' : 'Activate'}
                      </button>
                    )}
                    {u.role === 'admin' && <span style={{ fontSize: 12, color: 'var(--gray400)' }}>Admin</span>}
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
