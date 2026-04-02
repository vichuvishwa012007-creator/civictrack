import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_CLASS = { Pending: 'badge-pending', 'In Progress': 'badge-progress', Resolved: 'badge-resolved', Invalid: 'badge-invalid' };

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(false);
  const [updForm, setUpdForm] = useState({ status: '', admin_notes: '', assigned_to: '' });
  const [updating, setUpdating] = useState(false);
  const LIMIT = 15;

  const fetchComplaints = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: LIMIT });
    if (statusFilter) params.set('status', statusFilter);
    if (search) params.set('search', search);
    api.get(`/complaints?${params}`).then(({ data }) => {
      setComplaints(data.complaints);
      setTotal(data.total);
    }).finally(() => setLoading(false));
  }, [page, statusFilter, search]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const openModal = (c) => {
    setSelected(c);
    setUpdForm({ status: c.status, admin_notes: c.admin_notes || '', assigned_to: c.assigned_to || '' });
    setModal(true);
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await api.patch(`/complaints/${selected.complaint_id}/status`, updForm);
      toast.success('Status updated successfully!');
      setModal(false);
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (complaintId) => {
    if (!window.confirm(`Delete complaint ${complaintId}? This cannot be undone.`)) return;
    try {
      await api.delete(`/complaints/${complaintId}`);
      toast.success('Complaint deleted.');
      fetchComplaints();
    } catch (err) {
      toast.error('Delete failed.');
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      <div className="page-header mb-3">
        <div>
          <div className="page-title">All Complaints</div>
          <div className="page-sub">{total} total complaints</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input className="search-input" style={{ flex: 1, minWidth: 200 }} placeholder="Search by ID, name, or description…" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select className="form-control" style={{ width: 160 }} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          {['Pending', 'In Progress', 'Resolved', 'Invalid'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="filter-chips mb-2">
        {[['', 'All'], ['Pending', 'Pending'], ['In Progress', 'In Progress'], ['Resolved', 'Resolved'], ['Invalid', 'Invalid']].map(([v, l]) => (
          <div key={l} className={`chip${statusFilter === v ? ' active' : ''}`} onClick={() => { setStatusFilter(v); setPage(1); }}>{l}</div>
        ))}
      </div>

      {loading ? (
        <div className="loading-page"><span className="spinner"></span></div>
      ) : (
        <>
          <div className="table-wrap mb-2">
            <table className="table">
              <thead>
                <tr><th>ID</th><th>Type</th><th>Name</th><th>Area</th><th>Priority</th><th>Status</th><th>Filed</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {complaints.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--gray400)' }}>No complaints found</td></tr>
                ) : complaints.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--gray500)' }}>{c.complaint_id}</td>
                    <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{c.issue_type === 'Street Light' ? '💡' : c.issue_type === 'Water Leakage' ? '💧' : '🌧️'} {c.issue_type}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{c.full_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray400)' }}>{c.phone}</div>
                    </td>
                    <td style={{ fontSize: 13 }}>{c.area}</td>
                    <td>
                      <span style={{ fontSize: 12, fontWeight: 700, color: c.priority === 'High' ? 'var(--danger)' : c.priority === 'Low' ? 'var(--gray400)' : 'var(--warn)' }}>
                        {c.priority === 'High' ? '🔴' : c.priority === 'Low' ? '🟢' : '🟡'} {c.priority}
                      </span>
                    </td>
                    <td><span className={`badge ${STATUS_CLASS[c.status]}`}>{c.status}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--gray400)', whiteSpace: 'nowrap' }}>{formatDate(c.created_at)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button className="btn btn-secondary btn-sm" style={{ marginRight: 6 }} onClick={() => openModal(c)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.complaint_id)}>Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
              <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ fontSize: 13, color: 'var(--gray500)' }}>Page {page} of {totalPages}</span>
              <button className="btn btn-secondary btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      {modal && selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 18, fontFamily: 'var(--font-head)' }}>Update Complaint</div>
              <button style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--gray400)' }} onClick={() => setModal(false)}>×</button>
            </div>
            <div style={{ background: 'var(--gray50)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13 }}>
              <div style={{ fontWeight: 600 }}>{selected.complaint_id} – {selected.issue_type}</div>
              <div style={{ color: 'var(--gray500)', marginTop: 2 }}>{selected.full_name} · {selected.area}</div>
              <div style={{ marginTop: 6, color: 'var(--gray600)', lineHeight: 1.5 }}>{selected.description}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={updForm.status} onChange={(e) => setUpdForm(f => ({ ...f, status: e.target.value }))}>
                {['Pending', 'In Progress', 'Resolved', 'Invalid'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Assigned To</label>
              <input className="form-control" placeholder="e.g. Electrical Dept – Team B" value={updForm.assigned_to} onChange={(e) => setUpdForm(f => ({ ...f, assigned_to: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Admin Note (visible to citizen)</label>
              <textarea className="form-control" rows={3} placeholder="Update note for the citizen…" value={updForm.admin_notes} onChange={(e) => setUpdForm(f => ({ ...f, admin_notes: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleUpdate} disabled={updating}>
                {updating ? <><span className="spinner" style={{ width: 16, height: 16 }}></span> Saving…</> : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
