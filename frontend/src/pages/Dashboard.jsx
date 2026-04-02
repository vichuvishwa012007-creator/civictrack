import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STATUS_CLASS = { Pending: 'badge-pending', 'In Progress': 'badge-progress', Resolved: 'badge-resolved', Invalid: 'badge-invalid' };
const PROGRESS = { Pending: 10, 'In Progress': 55, Resolved: 100, Invalid: 0 };

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Dashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.get('/complaints/my').then(({ data }) => setComplaints(data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? complaints : complaints.filter((c) => c.status === filter);
  const counts = { All: complaints.length, Pending: 0, 'In Progress': 0, Resolved: 0, Invalid: 0 };
  complaints.forEach((c) => { if (counts[c.status] !== undefined) counts[c.status]++; });

  return (
    <div className="content-wrap">
      <div className="page-header">
        <div>
          <div className="page-title">My Complaints</div>
          <div className="page-sub">Welcome back, {user?.name?.split(' ')[0]}</div>
        </div>
        <Link to="/submit" className="btn btn-primary">+ New Complaint</Link>
      </div>

      {/* Stats row */}
      <div className="grid-4 mb-3">
        {[['Total', complaints.length, '#1B4FD8'], ['Pending', counts.Pending, '#B45309'], ['In Progress', counts['In Progress'], '#6366F1'], ['Resolved', counts.Resolved, '#16A34A']].map(([l, v, c]) => (
          <div key={l} className="metric-card">
            <div className="metric-label">{l}</div>
            <div className="metric-value" style={{ color: c, fontSize: 28 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-chips mb-2">
        {['All', 'Pending', 'In Progress', 'Resolved', 'Invalid'].map((s) => (
          <div key={s} className={`chip${filter === s ? ' active' : ''}`} onClick={() => setFilter(s)}>
            {s} ({counts[s] ?? complaints.length})
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loading-page"><span className="spinner"></span></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>No complaints found</div>
          <Link to="/submit" className="btn btn-primary">Submit Your First Complaint</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((c) => (
            <div key={c.id} className="complaint-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                    {c.issue_type === 'Street Light' ? '💡' : c.issue_type === 'Water Leakage' ? '💧' : '🌧️'} {c.issue_type}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray400)' }}>{c.complaint_id}</div>
                </div>
                <span className={`badge ${STATUS_CLASS[c.status]}`}>{c.status}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--gray600)', marginBottom: 8, lineHeight: 1.5 }}>{c.description.slice(0, 120)}{c.description.length > 120 ? '…' : ''}</div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--gray400)', marginBottom: 10 }}>
                <span>📍 {c.area}</span>
                <span>📅 {formatDate(c.created_at)}</span>
                <span>⚡ {c.priority}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="progress" style={{ flex: 1 }}>
                  <div className="progress-fill" style={{ width: `${PROGRESS[c.status]}%`, background: c.status === 'Resolved' ? 'var(--success)' : c.status === 'Invalid' ? 'var(--gray300)' : 'var(--brand)' }}></div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/track?id=${c.complaint_id}`} className="btn btn-secondary btn-sm">Track</Link>
                  {c.status === 'Resolved' && (
                    <Link to={`/feedback/${c.complaint_id}`} className="btn btn-success btn-sm">Rate ⭐</Link>
                  )}
                </div>
              </div>
              {c.admin_notes && (
                <div style={{ marginTop: 10, background: 'var(--brand-light)', borderRadius: 6, padding: '8px 12px', fontSize: 13, color: 'var(--brand)' }}>
                  💬 Admin note: {c.admin_notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
