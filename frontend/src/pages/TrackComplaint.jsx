import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_CLASS = { Pending: 'badge-pending', 'In Progress': 'badge-progress', Resolved: 'badge-resolved', Invalid: 'badge-invalid' };

const STEPS = ['Pending', 'In Progress', 'Resolved'];

function formatDate(d) {
  return new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function TrackComplaint() {
  const [params] = useSearchParams();
  const [complaintId, setComplaintId] = useState(params.get('id') || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.get('id')) handleSearch(params.get('id'));
  }, []);

  const handleSearch = async (id) => {
    const cid = (id || complaintId).trim().toUpperCase();
    if (!cid) return toast.error('Please enter a complaint ID.');
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.get(`/complaints/track/${cid}`);
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Complaint not found.');
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = result ? STEPS.indexOf(result.complaint.status) : -1;

  return (
    <div className="content-wrap" style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div>
          <div className="page-title">Track Your Complaint</div>
          <div className="page-sub">Enter your complaint ID to check its status</div>
        </div>
      </div>

      <div className="search-box mb-3">
        <input
          className="search-input"
          placeholder="e.g. CMP-2024-1082"
          value={complaintId}
          onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn btn-primary" onClick={() => handleSearch()} disabled={loading}>
          {loading ? <span className="spinner" style={{ width: 16, height: 16 }}></span> : '🔍 Search'}
        </button>
      </div>

      {result && (
        <>
          {/* Complaint summary */}
          <div className="card mb-3">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{result.complaint.issue_type}</div>
                <div style={{ fontSize: 13, color: 'var(--gray400)' }}>{result.complaint.complaint_id}</div>
              </div>
              <span className={`badge ${STATUS_CLASS[result.complaint.status]}`}>{result.complaint.status}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', fontSize: 13 }}>
              {[['👤 Complainant', result.complaint.full_name], ['📍 Area', result.complaint.area], ['📅 Filed On', formatDate(result.complaint.created_at)], ['⚡ Priority', result.complaint.priority]].map(([l, v]) => (
                <div key={l}><span style={{ color: 'var(--gray400)' }}>{l}: </span><span style={{ fontWeight: 600 }}>{v}</span></div>
              ))}
            </div>
            {result.complaint.description && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--gray50)', borderRadius: 8, fontSize: 13, color: 'var(--gray600)', lineHeight: 1.6 }}>
                {result.complaint.description}
              </div>
            )}
            {result.complaint.admin_notes && (
              <div style={{ marginTop: 10, background: 'var(--brand-light)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--brand)' }}>
                💬 <strong>Admin note:</strong> {result.complaint.admin_notes}
              </div>
            )}
          </div>

          {/* Progress steps */}
          {result.complaint.status !== 'Invalid' && (
            <div className="card mb-3">
              <div style={{ fontWeight: 700, marginBottom: 20, fontSize: 15 }}>Resolution Progress</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 16, left: '16%', right: '16%', height: 3, background: 'var(--gray200)', zIndex: 0 }}>
                  <div style={{ height: '100%', background: 'var(--brand)', width: stepIndex === 0 ? '0%' : stepIndex === 1 ? '50%' : '100%', transition: 'width .5s' }}></div>
                </div>
                {STEPS.map((s, i) => (
                  <div key={s} style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, background: i <= stepIndex ? 'var(--brand)' : 'var(--gray200)', color: i <= stepIndex ? '#fff' : 'var(--gray400)', border: '3px solid #fff', boxShadow: i === stepIndex ? '0 0 0 3px var(--brand-light)' : 'none', transition: 'all .3s' }}>
                      {i < stepIndex ? '✓' : i + 1}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: i <= stepIndex ? 'var(--brand)' : 'var(--gray400)' }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 20, fontSize: 15 }}>Activity Timeline</div>
            <div className="timeline">
              {result.history.map((h, i) => (
                <div key={h.id} className="tl-item">
                  <div className={`tl-dot${i === result.history.length - 1 ? ' active' : ' done'}`}></div>
                  <div className="tl-date">{formatDate(h.created_at)}</div>
                  <div className="tl-label">Status → {h.new_status}</div>
                  {h.note && <div className="tl-desc">{h.note}</div>}
                  <div className="tl-desc">By: {h.changed_by}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!result && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Enter a complaint ID above</div>
          <div style={{ fontSize: 13 }}>e.g. CMP-2024-1082</div>
        </div>
      )}
    </div>
  );
}
