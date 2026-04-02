import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../utils/api';

const STATUS_CLASS = { Pending: 'badge-pending', 'In Progress': 'badge-progress', Resolved: 'badge-resolved', Invalid: 'badge-invalid' };
const PIE_COLORS = ['#22C55E', '#6366F1', '#F59E0B', '#EF4444'];

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/complaints/admin/analytics').then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><span className="spinner"></span></div>;
  if (!data) return <div>Failed to load analytics.</div>;

  return (
    <div>
      <div className="page-header mb-3">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Overview of all civic complaints</div>
        </div>
        <button className="btn btn-secondary" onClick={() => window.print()}>📊 Print Report</button>
      </div>

      {/* Metric cards */}
      <div className="grid-4 mb-3">
        {[
          ['Total Complaints', data.total, 'var(--brand)'],
          ['Pending', data.pending, '#B45309'],
          ['In Progress', data.in_progress, 'var(--brand-mid)'],
          ['Resolved', data.resolved, 'var(--success)'],
        ].map(([l, v, c]) => (
          <div key={l} className="metric-card">
            <div className="metric-label">{l}</div>
            <div className="metric-value" style={{ color: c }}>{v}</div>
            <div className="metric-sub">{l === 'Resolved' && data.total ? `${Math.round(v / data.total * 100)}% resolution rate` : l === 'Total' ? `${data.total_users} registered users` : ''}</div>
          </div>
        ))}
      </div>

      <div className="grid-2 mb-3">
        {/* Category bar chart */}
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Complaints by Category</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.by_type} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="issue_type" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="cnt" name="Complaints" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie chart */}
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Status Breakdown</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.by_status} dataKey="cnt" nameKey="status" cx="50%" cy="50%" outerRadius={75} label={({ status, percent }) => `${status} ${Math.round(percent * 100)}%`} labelLine={false} fontSize={11}>
                {data.by_status.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Area chart */}
      <div className="card mb-3">
        <div style={{ fontWeight: 700, marginBottom: 16 }}>Area-wise Complaints</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.by_area} layout="vertical" margin={{ left: 60, right: 20 }}>
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="area" tick={{ fontSize: 12 }} width={80} />
            <Tooltip />
            <Bar dataKey="cnt" name="Complaints" fill="#1B4FD8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent complaints */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontWeight: 700 }}>Recent Complaints</div>
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = '#complaints'; }} style={{ fontSize: 13, color: 'var(--brand)' }}>View all →</a>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>ID</th><th>Type</th><th>Area</th><th>Priority</th><th>Status</th><th>Filed</th></tr></thead>
            <tbody>
              {data.recent.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--gray500)' }}>{c.complaint_id}</td>
                  <td style={{ fontWeight: 600 }}>{c.issue_type}</td>
                  <td>{c.area}</td>
                  <td><span style={{ fontSize: 12, fontWeight: 600, color: c.priority === 'High' ? 'var(--danger)' : c.priority === 'Low' ? 'var(--gray400)' : 'var(--warn)' }}>{c.priority}</span></td>
                  <td><span className={`badge ${STATUS_CLASS[c.status]}`}>{c.status}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--gray400)' }}>{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.avg_rating > 0 && (
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--warn-bg)', borderRadius: 8, fontSize: 13 }}>
            ⭐ Average citizen satisfaction rating: <strong>{data.avg_rating}/5</strong>
          </div>
        )}
      </div>
    </div>
  );
}
