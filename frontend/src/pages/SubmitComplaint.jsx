import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ISSUE_TYPES = [
  { key: 'Street Light', icon: '💡', label: 'Street Light' },
  { key: 'Water Leakage', icon: '💧', label: 'Water Leakage' },
  { key: 'Rainwater Issue', icon: '🌧️', label: 'Rainwater Issue' },
];

const AREAS = ['Anna Nagar', 'Fairlands', 'Suramangalam', 'Hasthampatti', 'Kondalampatti', 'Ammapet', 'Swarnapuri', 'Attur Road'];

export default function SubmitComplaint() {
  const navigate = useNavigate();
  const [issueType, setIssueType] = useState('Street Light');
  const [form, setForm] = useState({ full_name: '', phone: '', address: '', area: '', description: '', priority: 'Normal' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB.');
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.phone || !form.address || !form.area || !form.description) {
      return toast.error('Please fill all required fields.');
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('issue_type', issueType);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);

      const { data } = await api.post('/complaints', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(`Complaint submitted! ID: ${data.complaint.complaint_id}`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrap" style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div>
          <div className="page-title">Submit a Complaint</div>
          <div className="page-sub">Describe the civic issue and we'll get it resolved</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card mb-3">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Type of Issue <span style={{ color: 'var(--danger)' }}>*</span></label>
            <div className="issue-picker" style={{ marginTop: 8 }}>
              {ISSUE_TYPES.map(({ key, icon, label }) => (
                <div key={key} className={`issue-option${issueType === key ? ' selected' : ''}`} onClick={() => setIssueType(key)}>
                  <div className="icon">{icon}</div>
                  <div className="label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card mb-3">
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Your Details</div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input className="form-control" placeholder="e.g. Ravi Kumar" value={form.full_name} onChange={set('full_name')} />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Number <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input className="form-control" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={set('phone')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Full Address <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input className="form-control" placeholder="Door no, Street, Landmark" value={form.address} onChange={set('address')} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Area / Locality <span style={{ color: 'var(--danger)' }}>*</span></label>
              <select className="form-control" value={form.area} onChange={set('area')}>
                <option value="">Select Area</option>
                {AREAS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <select className="form-control" value={form.priority} onChange={set('priority')}>
                <option value="Normal">Normal</option>
                <option value="High">High – Safety Risk</option>
                <option value="Low">Low – Minor Issue</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Description <span style={{ color: 'var(--danger)' }}>*</span></label>
            <textarea className="form-control" rows={4} placeholder="Describe the issue in detail — exact location, how long it's been present, any hazards…" value={form.description} onChange={set('description')} />
          </div>
        </div>

        <div className="card mb-3">
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Photo Evidence <span style={{ fontWeight: 400, color: 'var(--gray400)', fontSize: 13 }}>(optional)</span></div>
          <label htmlFor="img-upload" className={`upload-zone${preview ? ' has-file' : ''}`} style={{ display: 'block' }}>
            {preview ? (
              <div>
                <img src={preview} alt="Preview" style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 8, marginBottom: 8 }} />
                <div style={{ fontSize: 13, color: 'var(--success)' }}>✅ {image?.name}</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                <div style={{ fontWeight: 600, color: 'var(--gray600)', marginBottom: 4 }}>Click to upload a photo</div>
                <div style={{ fontSize: 12, color: 'var(--gray400)' }}>JPG, PNG, WEBP – max 5MB</div>
              </>
            )}
          </label>
          <input id="img-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
        </div>

        <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" style={{ width: 18, height: 18 }}></span> Submitting…</> : '📤 Submit Complaint'}
        </button>
      </form>
    </div>
  );
}
