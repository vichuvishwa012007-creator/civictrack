import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const LABELS = ['', 'Very Poor', 'Poor', 'Average', 'Good', 'Excellent'];

export default function Feedback() {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [existing, setExisting] = useState(null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [form, setForm] = useState({ speed_rating: 'Moderate (2–5 days)', comments: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/complaints/track/${complaintId}`),
      api.get(`/feedback/${complaintId}`).catch(() => ({ data: null }))
    ]).then(([cRes, fRes]) => {
      setComplaint(cRes.data.complaint);
      setExisting(fRes.data);
      if (fRes.data) setRating(fRes.data.rating);
    }).finally(() => setLoading(false));
  }, [complaintId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error('Please select a rating.');
    setSubmitting(true);
    try {
      await api.post('/feedback', { complaint_id: complaintId, rating, ...form });
      toast.success('Thank you for your feedback!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-page"><span className="spinner"></span></div>;
  if (!complaint) return <div className="content-wrap"><div className="empty-state"><div className="empty-icon">❌</div><div>Complaint not found</div></div></div>;
  if (complaint.status !== 'Resolved') return (
    <div className="content-wrap" style={{ maxWidth: 560 }}>
      <div className="empty-state"><div className="empty-icon">⏳</div><div style={{ fontWeight: 600 }}>Complaint not yet resolved</div><div style={{ fontSize: 13 }}>Feedback is only available after the issue is resolved.</div></div>
    </div>
  );

  return (
    <div className="content-wrap" style={{ maxWidth: 560 }}>
      <div className="page-title mb-1">Rate the Service</div>
      <div className="page-sub mb-3">Your feedback helps improve municipal services</div>

      <div className="card mb-3" style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700 }}>{complaint.issue_type}</div>
            <div style={{ fontSize: 12, color: 'var(--gray400)' }}>{complaint.complaint_id} · {complaint.area}</div>
          </div>
          <span className="badge badge-resolved">✅ Resolved</span>
        </div>
      </div>

      {existing ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>⭐</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Feedback Already Submitted</div>
          <div style={{ color: 'var(--gray500)', marginBottom: 16 }}>You rated this {existing.rating}/5 – {LABELS[existing.rating]}</div>
          {existing.comments && <div style={{ fontStyle: 'italic', color: 'var(--gray600)', fontSize: 14 }}>"{existing.comments}"</div>}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="card mb-3">
            <div className="form-label mb-1">Overall Satisfaction</div>
            <div className="stars mb-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={`star${(hovered || rating) >= n ? ' lit' : ''}`}
                  onClick={() => setRating(n)} onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}>★</span>
              ))}
            </div>
            {(hovered || rating) > 0 && (
              <div style={{ fontSize: 13, color: 'var(--gray500)', fontWeight: 500 }}>
                {hovered || rating}/5 – {LABELS[hovered || rating]}
              </div>
            )}
          </div>

          <div className="card mb-3">
            <div className="form-group">
              <label className="form-label">Resolution Speed</label>
              <select className="form-control" value={form.speed_rating} onChange={(e) => setForm(f => ({ ...f, speed_rating: e.target.value }))}>
                <option>Fast (within 1 day)</option>
                <option>Moderate (2–5 days)</option>
                <option>Slow (more than 5 days)</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Comments (optional)</label>
              <textarea className="form-control" rows={3} placeholder="Any additional feedback or suggestions…" value={form.comments} onChange={(e) => setForm(f => ({ ...f, comments: e.target.value }))} />
            </div>
          </div>

          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={submitting}>
            {submitting ? <><span className="spinner" style={{ width: 18, height: 18 }}></span> Submitting…</> : '⭐ Submit Feedback'}
          </button>
        </form>
      )}
    </div>
  );
}
